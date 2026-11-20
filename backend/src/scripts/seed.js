import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Batch from '../models/Batch.js';
import Enrollment from '../models/Enrollment.js';
import Payment from '../models/Payment.js';
import LiveClass from '../models/LiveClass.js';
import Assignment from '../models/Assignment.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log('[Seed] Clearing existing collections...');
    await User.deleteMany();
    await Course.deleteMany();
    await Batch.deleteMany();
    await Enrollment.deleteMany();
    await Payment.deleteMany();
    await LiveClass.deleteMany();
    await Assignment.deleteMany();

    console.log('[Seed] Creating demo users...');
    const users = await User.create([
      {
        name: 'Priya Sharma',
        email: 'priya.sharma@example.com',
        password: 'password123',
        role: 'student',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        headline: 'Lifelong Learner & Culinary Enthusiast',
        bio: 'Software engineer by day, passionate home baker and calligraphy learner by evening.',
        location: 'Bangalore, India',
        phone: '+91 98765 43210',
      },
      {
        name: 'Dr. Ananya Roy',
        email: 'ananya.roy@example.com',
        password: 'password123',
        role: 'instructor',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        headline: 'Artisanal Baker & Sourdough Consultant',
        bio: 'Ex-food scientist turned artisanal sourdough baker with 12+ years experience. Small-batch interactive coaching.',
        location: 'Pune, India',
        phone: '+91 98230 11223',
        verificationStatus: 'Approved',
        experienceYears: 12,
        skills: ['Sourdough Fermentation', 'French Viennoiserie', 'Artisanal Bread', 'Gluten Science'],
        languages: ['English', 'Hindi', 'Bengali'],
        rating: 4.95,
        totalReviews: 86,
        totalStudents: 142,
        totalEarnings: 384500,
        availableBalance: 42000,
      },
      {
        name: 'Sunita Deshmukh',
        email: 'sunita.crafts@example.com',
        password: 'password123',
        role: 'instructor',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        headline: 'Traditional Madhubani & Warli Folk Artist',
        bio: 'Homemaker and certified traditional folk artist. Teaching traditional Indian folk arts in intimate live batches.',
        location: 'Nagpur, India',
        phone: '+91 97654 32109',
        verificationStatus: 'Pending Review',
        experienceYears: 8,
        skills: ['Madhubani Painting', 'Warli Art', 'Natural Pigments'],
        languages: ['Hindi', 'Marathi', 'English'],
        rating: 4.88,
        totalReviews: 24,
        totalStudents: 45,
        totalEarnings: 82000,
        availableBalance: 16500,
      },
      {
        name: 'Rohan Varma',
        email: 'rohan.tech@example.com',
        password: 'password123',
        role: 'instructor',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        headline: 'Senior Frontend Architect & Mentor',
        bio: 'Fullstack tech lead helping beginners and career switchers master modern JavaScript and React.',
        location: 'Hyderabad, India',
        phone: '+91 99887 76655',
        verificationStatus: 'Approved',
        experienceYears: 9,
        skills: ['JavaScript ES6+', 'React.js', 'Tailwind CSS', 'Web Performance'],
        languages: ['English', 'Telugu', 'Hindi'],
        rating: 4.92,
        totalReviews: 64,
        totalStudents: 98,
        totalEarnings: 295000,
        availableBalance: 31000,
      },
      {
        name: 'Arjun Mehta',
        email: 'admin@classify.ed',
        password: 'password123',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        headline: 'Classify Platform Administrator',
        location: 'Mumbai, India',
        phone: '+91 98111 22233',
      },
    ]);

    const student = users[0];
    const ananya = users[1];
    const sunita = users[2];
    const rohan = users[3];

    console.log('[Seed] Creating demo courses...');
    const courses = await Course.create([
      {
        title: 'Artisanal Sourdough & Wild Yeast Masterclass',
        slug: 'artisanal-sourdough-masterclass',
        instructor: ananya._id,
        instructorName: ananya.name,
        instructorAvatar: ananya.avatar,
        instructorHeadline: ananya.headline,
        category: 'Baking & Culinary',
        level: 'Beginner to Intermediate',
        language: 'English & Hindi',
        price: 3499,
        originalPrice: 4999,
        rating: 4.96,
        reviewsCount: 52,
        thumbnail: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=800&auto=format&fit=crop&q=80',
        shortDescription: 'Master 100% naturally leavened sourdough bread at home with real-time live dough-handling guidance in batches capped at 12 students.',
        fullDescription: 'Tired of dense, flat sourdough loaves? Join this intimate live coaching cohort where you will bake alongside Dr. Ananya Roy from starter creation to blistered oven spring.',
        learningOutcomes: [
          'Create and maintain a vigorous active sourdough starter',
          'Understand hydration ratios and gluten development',
          'Master coil folds, laminate shaping, and banneton tensioning',
          'Decode scoring techniques and steam hacks for open crumb',
        ],
        prerequisites: ['Digital kitchen scale', 'Bread flour', 'Dutch oven or heavy pot'],
        curriculum: [
          { week: 1, title: 'Wild Yeast Microbiome & Starter Awakening', sessions: 2, duration: '90 mins', topics: ['Feeding ratios', 'Temperature regulation'] },
          { week: 2, title: 'Hydration Math & The Autolyse Stage', sessions: 2, duration: '90 mins', topics: ['Baker percentages', 'Windowpane test'] },
          { week: 3, title: 'Bulk Fermentation & Dough Architecture', sessions: 2, duration: '90 mins', topics: ['Coil folds', 'Assessing volume rise'] },
          { week: 4, title: 'Scoring, Steam Injection & High Heat Baking', sessions: 2, duration: '90 mins', topics: ['Razor blade scoring', 'Crumb critique'] },
        ],
        status: 'Approved',
        totalEnrolledStudents: 48,
        activeBatchesCount: 2,
      },
      {
        title: 'Madhubani & Mithila Folk Painting Immersion',
        slug: 'madhubani-folk-painting-immersion',
        instructor: sunita._id,
        instructorName: sunita.name,
        instructorAvatar: sunita.avatar,
        instructorHeadline: sunita.headline,
        category: 'Folk Arts & Crafts',
        level: 'All Levels',
        language: 'Hindi & English',
        price: 2499,
        originalPrice: 3500,
        rating: 4.89,
        reviewsCount: 38,
        thumbnail: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
        shortDescription: 'Learn authentic line work and color filling styles of Madhubani art. Strict limit of 10 students ensures hands-on brush stroke review.',
        fullDescription: 'Discover the ancient cultural art of Mithila from home. Guided step-by-step through traditional motifs using nib pens, handmade paper, and acrylics.',
        learningOutcomes: [
          'Master Kachni and Bharni painting techniques',
          'Draw classic folk elements: Fish, Peacocks, Lotus, and Tree of Life',
          'Compose a finished A3-size heritage artwork ready for framing',
        ],
        status: 'Approved',
        totalEnrolledStudents: 32,
        activeBatchesCount: 1,
      },
      {
        title: 'Modern React & JavaScript for Career Switchers',
        slug: 'modern-react-career-switchers',
        instructor: rohan._id,
        instructorName: rohan.name,
        instructorAvatar: rohan.avatar,
        instructorHeadline: rohan.headline,
        category: 'Coding & Tech for Beginners',
        level: 'Beginner',
        language: 'English',
        price: 4999,
        originalPrice: 7999,
        rating: 4.94,
        reviewsCount: 46,
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
        shortDescription: 'Build real-world web apps with direct 1-on-1 code reviews in weekly live cohorts capped at 15 learners.',
        fullDescription: 'Break into frontend engineering with a live coding curriculum. Every session is half live coding and half student screen sharing with real-time error debugging.',
        learningOutcomes: [
          'Write modern ES6+ JavaScript with confidence',
          'Build dynamic user interfaces with React hooks and props',
          'Integrate REST APIs and manage asynchronous state effortlessly',
        ],
        status: 'Approved',
        totalEnrolledStudents: 38,
        activeBatchesCount: 1,
      },
    ]);

    console.log('[Seed] Scheduling small-batch cohorts...');
    const batches = await Batch.create([
      {
        name: 'Weekend Sourdough Morning Cohort #8',
        course: courses[0]._id,
        courseTitle: courses[0].title,
        instructor: ananya._id,
        instructorName: ananya.name,
        startDate: '2026-11-25',
        endDate: '2026-12-20',
        days: ['Saturday', 'Sunday'],
        daysDisplay: 'Sat & Sun',
        timing: '10:00 AM - 11:30 AM IST',
        durationMinutes: 90,
        fee: 3499,
        maxCapacity: 12, // Strict small-batch rule: recommended 10-15
        enrolledCount: 10,
        status: 'Upcoming',
        description: 'Perfect for weekend home bakers. Live dough handling and oven spring review.',
      },
      {
        name: 'Weekday Evening Cohort #9',
        course: courses[0]._id,
        courseTitle: courses[0].title,
        instructor: ananya._id,
        instructorName: ananya.name,
        startDate: '2026-12-05',
        endDate: '2026-12-31',
        days: ['Tuesday', 'Thursday'],
        daysDisplay: 'Tue & Thu',
        timing: '07:30 PM - 09:00 PM IST',
        durationMinutes: 90,
        fee: 3499,
        maxCapacity: 15,
        enrolledCount: 6,
        status: 'Upcoming',
        description: 'Designed for working professionals after office hours.',
      },
      {
        name: 'React FastTrack Cohort Alpha',
        course: courses[2]._id,
        courseTitle: courses[2].title,
        instructor: rohan._id,
        instructorName: rohan.name,
        startDate: '2026-11-22',
        endDate: '2026-12-18',
        days: ['Monday', 'Wednesday', 'Friday'],
        daysDisplay: 'Mon, Wed, Fri',
        timing: '08:00 PM - 09:30 PM IST',
        durationMinutes: 90,
        fee: 4999,
        maxCapacity: 15,
        enrolledCount: 13,
        status: 'Upcoming',
        description: 'Intensive code-along sessions with personal GitHub PR reviews.',
      },
    ]);

    console.log('[Seed] Enrolling demo student and creating payments...');
    const sourdoughBatch = batches[0];
    const txnId1 = 'TXN-98432101';

    await Payment.create({
      transactionId: txnId1,
      student: student._id,
      studentName: student.name,
      course: courses[0]._id,
      courseTitle: courses[0].title,
      batch: sourdoughBatch._id,
      batchName: sourdoughBatch.name,
      instructor: ananya._id,
      instructorName: ananya.name,
      amount: 3499,
      platformFee: 524.85,
      instructorPayout: 2974.15,
      method: 'UPI / Razorpay',
      status: 'Completed',
    });

    await Enrollment.create({
      student: student._id,
      studentName: student.name,
      studentEmail: student.email,
      studentAvatar: student.avatar,
      course: courses[0]._id,
      courseTitle: courses[0].title,
      batch: sourdoughBatch._id,
      batchName: sourdoughBatch.name,
      instructor: ananya._id,
      instructorName: ananya.name,
      amountPaid: 3499,
      paymentId: txnId1,
      paymentStatus: 'Completed',
      progressPercentage: 65,
      attendanceRate: 92,
    });

    console.log('[Seed] Scheduling live classroom session...');
    await LiveClass.create({
      batch: sourdoughBatch._id,
      batchName: sourdoughBatch.name,
      course: courses[0]._id,
      courseTitle: courses[0].title,
      instructor: ananya._id,
      instructorName: ananya.name,
      title: 'Session 5: Bulk Fermentation & Tension Shaping',
      date: '2026-11-25',
      time: '10:00 AM - 11:30 AM IST',
      durationMinutes: 90,
      status: 'Scheduled',
      agenda: 'Real-time dough handling and assessing fermentation volume rise.',
      materialsNeeded: ['Active fermented dough bowl', 'Bench scraper', 'Water spray'],
    });

    console.log('[Seed] Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error] ${error.message}`);
    process.exit(1);
  }
};

seedData();
