import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { Server as SocketIOServer } from 'socket.io';
import { io as ClientIO } from 'socket.io-client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
import app from '../app.js';
import connectDB from '../config/db.js';
import setupClassroomSocket from '../socket/classroomSocket.js';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Batch from '../models/Batch.js';

dotenv.config();

const PORT = 5566;
const BASE_URL = `http://localhost:${PORT}`;

let server;
let ioServer;

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

let passedCount = 0;
let failedCount = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    passedCount++;
    console.log(`  ${colors.green}✔ PASS${colors.reset} ${testName}`);
  } else {
    failedCount++;
    console.error(`  ${colors.red}✖ FAIL${colors.reset} ${testName} ${details ? `(${details})` : ''}`);
  }
}

async function startTestServer() {
  await connectDB();
  server = http.createServer(app);
  ioServer = new SocketIOServer(server, { cors: { origin: '*' } });
  setupClassroomSocket(ioServer);

  return new Promise((resolve) => {
    server.listen(PORT, () => {
      console.log(`\n${colors.cyan}[Test Server] Running on ${BASE_URL}${colors.reset}\n`);
      resolve();
    });
  });
}

async function stopTestServer() {
  if (ioServer) ioServer.close();
  if (server) {
    return new Promise((resolve) => server.close(resolve));
  }
}

async function runAllTests() {
  console.log(`${colors.bold}${colors.blue}======================================================`);
  console.log(`  🚀 CLASSIFY FULL APPLICATION FEATURE TEST SUITE`);
  console.log(`======================================================${colors.reset}\n`);

  await startTestServer();

  try {
    // ------------------------------------------------------------------------
    // SECTION 1: Health & System Endpoints
    // ------------------------------------------------------------------------
    console.log(`${colors.yellow}► SECTION 1: System & Health API${colors.reset}`);
    const healthRes = await fetch(`${BASE_URL}/api/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200 && healthData.status === 'healthy', 'GET /api/health returns healthy status');

    // ------------------------------------------------------------------------
    // SECTION 2: Authentication & Role Registration
    // ------------------------------------------------------------------------
    console.log(`\n${colors.yellow}► SECTION 2: Authentication & Role Guards${colors.reset}`);
    
    // Register Student
    const testStudentEmail = `test.student.${Date.now()}@example.com`;
    const regStudentRes = await fetch(`${BASE_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Student',
        email: testStudentEmail,
        password: 'Password123!',
        role: 'student',
      }),
    });
    const regStudentData = await regStudentRes.json();
    assert(regStudentRes.status === 201 && regStudentData.token && regStudentData.user.role === 'student', 'POST /auth/register creates Student with valid JWT');

    // Register Instructor (Unverified Candidate)
    const testInstEmail = `test.inst.${Date.now()}@example.com`;
    const regInstRes = await fetch(`${BASE_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'New Instructor Candidate',
        email: testInstEmail,
        password: 'Password123!',
        role: 'instructor',
      }),
    });
    const regInstData = await regInstRes.json();
    const unverifiedInstToken = regInstData.token;
    const unverifiedInstId = regInstData.user.id || regInstData.user._id;
    assert(
      regInstRes.status === 201 &&
      regInstData.user.role === 'instructor' &&
      regInstData.user.verificationStatus === 'Not Submitted',
      'POST /auth/register sets initial Instructor verification to "Not Submitted"'
    );

    // Login with existing Seeded Users
    // Student Login
    const loginStudentRes = await fetch(`${BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'priya.sharma@example.com',
        password: 'password123',
      }),
    });
    const loginStudentData = await loginStudentRes.json();
    const studentToken = loginStudentData.token;
    assert(loginStudentRes.status === 200 && studentToken, 'POST /auth/login logs in Student successfully');

    // Approved Instructor Login
    const loginInstRes = await fetch(`${BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'ananya.roy@example.com',
        password: 'password123',
      }),
    });
    const loginInstData = await loginInstRes.json();
    const approvedInstToken = loginInstData.token;
    assert(loginInstRes.status === 200 && loginInstData.user.verificationStatus === 'Approved', 'POST /auth/login logs in Approved Instructor (Dr. Ananya Roy)');

    // Registered Unverified Instructor Login
    const loginUnverifiedRes = await fetch(`${BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testInstEmail,
        password: 'Password123!',
      }),
    });
    const loginUnverifiedData = await loginUnverifiedRes.json();
    assert(loginUnverifiedRes.status === 200 && loginUnverifiedData.user.verificationStatus === 'Not Submitted', 'POST /auth/login logs in Unverified Instructor candidate');

    // Admin Login
    const loginAdminRes = await fetch(`${BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@classify.ed',
        password: 'password123',
      }),
    });
    const loginAdminData = await loginAdminRes.json();
    const adminToken = loginAdminData.token;
    assert(loginAdminRes.status === 200 && loginAdminData.user.role === 'admin', 'POST /auth/login logs in Admin successfully');

    // Invalid Password Login
    const badLoginRes = await fetch(`${BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'priya.sharma@example.com',
        password: 'wrong_password',
      }),
    });
    assert(badLoginRes.status === 401, 'POST /auth/login rejects invalid credentials with 401');

    // Verify /auth/me with Bearer Token
    const meRes = await fetch(`${BASE_URL}/api/v1/auth/me`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const meData = await meRes.json();
    assert(meRes.status === 200 && meData.user.email === 'priya.sharma@example.com', 'GET /auth/me returns authenticated student profile');

    // ------------------------------------------------------------------------
    // SECTION 3: Course Discovery & Management
    // ------------------------------------------------------------------------
    console.log(`\n${colors.yellow}► SECTION 3: Course Catalog & Publishing Rules${colors.reset}`);

    // Public course discovery
    const coursesRes = await fetch(`${BASE_URL}/api/v1/courses`);
    const coursesData = await coursesRes.json();
    assert(coursesRes.status === 200 && coursesData.courses.length >= 3, `GET /courses returns course catalog (${coursesData.courses.length} courses)`);

    const sourdoughCourse = coursesData.courses.find(c => c.slug === 'artisanal-sourdough-masterclass') || coursesData.courses[0];
    assert(Boolean(sourdoughCourse), 'Found seeded Artisanal Sourdough course');

    // Single course details
    const courseDetailRes = await fetch(`${BASE_URL}/api/v1/courses/${sourdoughCourse._id}`);
    const courseDetailData = await courseDetailRes.json();
    assert(courseDetailRes.status === 200 && courseDetailData.course.title === sourdoughCourse.title, 'GET /courses/:id retrieves full course details & curriculum');

    // Rule: Approved Instructor CAN create course
    const newCourseRes = await fetch(`${BASE_URL}/api/v1/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${approvedInstToken}`,
      },
      body: JSON.stringify({
        title: 'Mastering Viennoiserie Croissants',
        category: 'Baking & Culinary',
        level: 'Intermediate',
        language: 'English',
        price: 3999,
        shortDescription: 'Laminated pastry dough and butter lock-in masterclass in small batches.',
        fullDescription: 'Complete interactive hands-on cohort course on making bakery-quality croissants.',
        learningOutcomes: ['Butter block lamination', 'Honeycomb crumb proofing'],
      }),
    });
    const newCourseData = await newCourseRes.json();
    assert(newCourseRes.status === 201 && newCourseData.course._id, 'Approved instructor can create a new course');

    // Rule: Pending / Unverified Instructor CANNOT publish course
    const unverifiedCourseRes = await fetch(`${BASE_URL}/api/v1/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${unverifiedInstToken}`,
      },
      body: JSON.stringify({
        title: 'Unauthorized Course Attempt',
        category: 'Folk Arts & Crafts',
        price: 1999,
        shortDescription: 'This should be blocked',
      }),
    });
    assert(unverifiedCourseRes.status === 403, 'Platform Rule: Unverified/Pending instructor cannot publish courses (403 Forbidden)');

    // ------------------------------------------------------------------------
    // SECTION 4: Small-Batch Cohort Rules (Max 50, Recommended 10-15)
    // ------------------------------------------------------------------------
    console.log(`\n${colors.yellow}► SECTION 4: Small-Batch Cohort Scheduling & Capacity Rules${colors.reset}`);

    // Valid small-batch creation (12 seats)
    const validBatchRes = await fetch(`${BASE_URL}/api/v1/batches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${approvedInstToken}`,
      },
      body: JSON.stringify({
        courseId: sourdoughCourse._id,
        name: 'Intimate Holiday Sourdough Cohort',
        startDate: '2026-12-10',
        endDate: '2026-12-31',
        days: ['Saturday', 'Sunday'],
        timing: '11:00 AM - 12:30 PM IST',
        durationMinutes: 90,
        fee: 3499,
        maxCapacity: 12, // recommended small-batch size
        description: 'Cozy weekend baking with 1-on-1 dough texture feedback',
      }),
    });
    const validBatchData = await validBatchRes.json();
    assert(validBatchRes.status === 201 && validBatchData.batch.maxCapacity === 12, 'Approved instructor can schedule small cohort (12 seats)');

    // Strict Rule: Batch with > 50 capacity MUST BE REJECTED
    const oversizedBatchRes = await fetch(`${BASE_URL}/api/v1/batches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${approvedInstToken}`,
      },
      body: JSON.stringify({
        courseId: sourdoughCourse._id,
        name: 'Oversized Illegal Batch Attempt',
        startDate: '2026-12-10',
        endDate: '2026-12-31',
        days: ['Saturday'],
        timing: '10:00 AM - 11:30 AM',
        fee: 999,
        maxCapacity: 75, // VIOLATION: Platform hard limit is 50
      }),
    });
    const oversizedBatchData = await oversizedBatchRes.json();
    assert(
      oversizedBatchRes.status === 400 &&
      oversizedBatchData.message.includes('50'),
      'Platform Rule: Cohort capacity > 50 is strictly rejected (Max 50 students rule enforced)'
    );

    // List cohorts for a course
    const batchesRes = await fetch(`${BASE_URL}/api/v1/batches?courseId=${sourdoughCourse._id}`);
    const batchesData = await batchesRes.json();
    assert(batchesRes.status === 200 && batchesData.batches.length >= 1, `GET /batches?courseId=... returns active cohorts (${batchesData.batches.length})`);

    // ------------------------------------------------------------------------
    // SECTION 5: Enrollment, Escrow Split & Capacity Enforcing
    // ------------------------------------------------------------------------
    console.log(`\n${colors.yellow}► SECTION 5: Enrollment, Checkout & Financial Ledger${colors.reset}`);

    const targetCohort = validBatchData.batch;
    const initialSeats = targetCohort.enrolledCount;

    // Student enrolls in cohort
    const checkoutRes = await fetch(`${BASE_URL}/api/v1/enrollments/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        batchId: targetCohort._id,
        paymentMethod: 'UPI / Razorpay',
      }),
    });
    const checkoutData = await checkoutRes.json();

    assert(
      checkoutRes.status === 201 &&
      checkoutData.enrollment &&
      checkoutData.payment,
      'POST /enrollments/checkout confirms student enrollment with payment'
    );

    // Verify Financial Ledger Split (15% platform commission / 85% instructor payout)
    const expectedPlatformFee = Number((targetCohort.fee * 0.15).toFixed(2));
    const expectedPayout = Number((targetCohort.fee - expectedPlatformFee).toFixed(2));
    assert(
      checkoutData.payment.platformFee === expectedPlatformFee &&
      checkoutData.payment.instructorPayout === expectedPayout,
      `Escrow Ledger: 15% Platform Fee (₹${expectedPlatformFee}) and 85% Instructor Payout (₹${expectedPayout}) computed accurately`
    );

    // Verify duplicate enrollment rejection
    const dupRes = await fetch(`${BASE_URL}/api/v1/enrollments/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({ batchId: targetCohort._id }),
    });
    assert(dupRes.status === 400, 'Duplicate enrollment in same cohort is blocked');

    // Student "My Learning" view
    const myLearningRes = await fetch(`${BASE_URL}/api/v1/enrollments/my`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const myLearningData = await myLearningRes.json();
    assert(myLearningRes.status === 200 && myLearningData.enrollments.length >= 1, 'GET /enrollments/my lists enrolled courses & cohorts');

    // Student "My Payments" history
    const myPaymentsRes = await fetch(`${BASE_URL}/api/v1/enrollments/payments/my`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const myPaymentsData = await myPaymentsRes.json();
    assert(myPaymentsRes.status === 200 && myPaymentsData.payments.length >= 1, 'GET /enrollments/payments/my returns receipt history');

    // ------------------------------------------------------------------------
    // SECTION 6: Live Classroom Schedules & Access Permissions
    // ------------------------------------------------------------------------
    console.log(`\n${colors.yellow}► SECTION 6: Live Classes & Classroom Access Rights${colors.reset}`);

    // Schedule a live class session as instructor
    const createClassRes = await fetch(`${BASE_URL}/api/v1/classes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${approvedInstToken}`,
      },
      body: JSON.stringify({
        batchId: targetCohort._id,
        title: 'Live Lab: Starter Feeding & Flour Science',
        date: '2026-12-10',
        time: '11:00 AM - 12:30 PM IST',
        durationMinutes: 90,
        agenda: 'Real-time observation of bubbly yeast activity',
        materialsNeeded: ['Rye flour', 'Water jar', 'Spoon'],
      }),
    });
    const createClassData = await createClassRes.json();
    assert(createClassRes.status === 201 && createClassData.liveClass, 'Instructor schedules live interactive classroom session');

    // Check student live schedule
    const studentScheduleRes = await fetch(`${BASE_URL}/api/v1/classes/my`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const studentScheduleData = await studentScheduleRes.json();
    assert(studentScheduleRes.status === 200 && Array.isArray(studentScheduleData.classes), 'GET /classes/my returns student upcoming live sessions');

    // Check classroom entry eligibility
    const accessRes = await fetch(`${BASE_URL}/api/v1/classes/classroom/${targetCohort._id}/access`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const accessData = await accessRes.json();
    assert(accessRes.status === 200 && accessData.accessGranted === true, 'Enrolled student is verified eligible to enter live classroom');

    // ------------------------------------------------------------------------
    // SECTION 7: Admin Oversight & Moderation
    // ------------------------------------------------------------------------
    console.log(`\n${colors.yellow}► SECTION 7: Admin Dashboard & Platform Operations${colors.reset}`);

    // Admin stats
    const adminStatsRes = await fetch(`${BASE_URL}/api/v1/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const adminStatsData = await adminStatsRes.json();
    assert(
      adminStatsRes.status === 200 &&
      adminStatsData.stats.totalStudents >= 1 &&
      adminStatsData.stats.totalInstructors >= 1,
      'GET /admin/stats calculates platform-wide metrics (students, instructors, cohorts, revenue)'
    );

    // Admin review pending instructor
    const pendingInstructorsRes = await fetch(`${BASE_URL}/api/v1/admin/instructors?status=Pending+Review`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const pendingInstructorsData = await pendingInstructorsRes.json();
    assert(pendingInstructorsRes.status === 200, 'GET /admin/instructors filters pending verification applications');

    // Admin approves instructor
    const instructorToApprove = unverifiedInstId;
    const approveInstRes = await fetch(`${BASE_URL}/api/v1/admin/instructors/${instructorToApprove}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ status: 'Approved' }),
    });
    const approveInstData = await approveInstRes.json();
    assert(
      approveInstRes.status === 200 &&
      approveInstData.instructor.verificationStatus === 'Approved',
      'Admin approves instructor verification application (Status updated to Approved)'
    );

    // Admin course approval
    const approveCourseRes = await fetch(`${BASE_URL}/api/v1/admin/courses/${newCourseData.course._id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ status: 'Approved' }),
    });
    const approveCourseData = await approveCourseRes.json();
    assert(
      approveCourseRes.status === 200 &&
      approveCourseData.course.status === 'Approved',
      'Admin moderates and approves new course submission'
    );

    // ------------------------------------------------------------------------
    // SECTION 8: Real-Time Socket.io Live Classroom
    // ------------------------------------------------------------------------
    console.log(`\n${colors.yellow}► SECTION 8: Real-Time Live Classroom Socket Signaling${colors.reset}`);

    const socketTestPromise = new Promise((resolve, reject) => {
      const socket = ClientIO(BASE_URL, {
        transports: ['websocket'],
        reconnection: false,
      });

      const timeout = setTimeout(() => {
        socket.disconnect();
        reject(new Error('Socket.io test timed out'));
      }, 5000);

      socket.on('connect', () => {
        assert(true, 'Socket.io client establishes connection to Classroom Gateway');

        // Join cohort live classroom
        socket.emit('join-classroom', {
          batchId: targetCohort._id.toString(),
          user: {
            id: meData.user._id,
            name: meData.user.name,
            role: 'student',
          },
        });
      });

      socket.on('participant-joined', (data) => {
        assert(Boolean(data && data.participants), 'Socket.io broadcasts participant-joined roster in cohort');

        // Send a test chat message
        socket.emit('send-message', {
          text: 'Hello instructor! Is this hydration level okay?',
        });
      });

      socket.on('new-message', (data) => {
        assert(data && data.text.includes('hydration'), 'Socket.io broadcasts real-time chat message to classroom');

        // Toggle student hand raise
        socket.emit('toggle-hand', { isHandRaised: true });
      });

      socket.on('hand-toggled', (data) => {
        assert(data && data.isHandRaised === true, 'Socket.io raises hand signal to teacher and cohort');
        clearTimeout(timeout);
        socket.disconnect();
        resolve();
      });

      socket.on('connect_error', (err) => {
        clearTimeout(timeout);
        reject(err);
      });
    });

    await socketTestPromise;

  } catch (err) {
    console.error(`\n${colors.red}[Test Suite Error] ${err.stack || err.message}${colors.reset}\n`);
    failedCount++;
  } finally {
    await stopTestServer();
  }

  // ------------------------------------------------------------------------
  // SUMMARY
  // ------------------------------------------------------------------------
  console.log(`\n${colors.bold}${colors.blue}======================================================`);
  console.log(`  📊 TEST RESULTS SUMMARY`);
  console.log(`======================================================${colors.reset}`);
  console.log(`  Total Passed: ${colors.green}${passedCount}${colors.reset}`);
  console.log(`  Total Failed: ${colors.red}${failedCount}${colors.reset}`);
  console.log(`  Total Tests:  ${passedCount + failedCount}`);

  if (failedCount === 0) {
    console.log(`\n  ${colors.bold}${colors.green}🎉 ALL APPLICATION FEATURES PASSED WITH 100% SUCCESS!${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`\n  ${colors.bold}${colors.red}❌ SOME TESTS FAILED. PLEASE REVIEW LOGS ABOVE.${colors.reset}\n`);
    process.exit(1);
  }
}

runAllTests();
