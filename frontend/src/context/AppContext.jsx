import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockCourses as initialCourses } from '../data/mockCourses';
import { mockBatches as initialBatches } from '../data/mockBatches';
import { 
  mockEnrollments as initialEnrollments,
  mockLiveClasses as initialLiveClasses,
  mockAssignments as initialAssignments,
  mockPayments as initialPayments,
  mockCertificates as initialCertificates
} from '../data/mockEnrollments';
import { mockUsers as initialUsers } from '../data/mockUsers';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // Courses state
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('classify_courses');
    return saved ? JSON.parse(saved) : initialCourses;
  });

  // Batches state
  const [batches, setBatches] = useState(() => {
    const saved = localStorage.getItem('classify_batches');
    return saved ? JSON.parse(saved) : initialBatches;
  });

  // Enrollments state
  const [enrollments, setEnrollments] = useState(() => {
    const saved = localStorage.getItem('classify_enrollments');
    return saved ? JSON.parse(saved) : initialEnrollments;
  });

  // Live Classes state
  const [liveClasses, setLiveClasses] = useState(() => {
    const saved = localStorage.getItem('classify_live_classes');
    return saved ? JSON.parse(saved) : initialLiveClasses;
  });

  // Assignments state
  const [assignments, setAssignments] = useState(() => {
    const saved = localStorage.getItem('classify_assignments');
    return saved ? JSON.parse(saved) : initialAssignments;
  });

  // Payments state
  const [payments, setPayments] = useState(() => {
    const saved = localStorage.getItem('classify_payments');
    return saved ? JSON.parse(saved) : initialPayments;
  });

  // Certificates state
  const [certificates, setCertificates] = useState(() => {
    const saved = localStorage.getItem('classify_certificates');
    return saved ? JSON.parse(saved) : initialCertificates;
  });

  // Users / Instructors state
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('classify_all_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('classify_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('classify_batches', JSON.stringify(batches));
  }, [batches]);

  useEffect(() => {
    localStorage.setItem('classify_enrollments', JSON.stringify(enrollments));
  }, [enrollments]);

  useEffect(() => {
    localStorage.setItem('classify_live_classes', JSON.stringify(liveClasses));
  }, [liveClasses]);

  useEffect(() => {
    localStorage.setItem('classify_assignments', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('classify_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('classify_all_users', JSON.stringify(users));
  }, [users]);

  // Actions: Courses
  const addCourse = (newCourseData, currentUser) => {
    const courseId = `course-${Date.now()}`;
    const newCourse = {
      id: courseId,
      slug: newCourseData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      ...newCourseData,
      instructorId: currentUser.id,
      instructorName: currentUser.name,
      instructorAvatar: currentUser.avatar,
      instructorHeadline: currentUser.headline || 'Skill Instructor',
      instructorRating: currentUser.rating || 5.0,
      instructorVerified: currentUser.verificationStatus === 'Approved',
      rating: 5.0,
      reviewsCount: 0,
      totalEnrolledStudents: 0,
      activeBatchesCount: 0,
      status: 'Pending Review', // Requires admin approval
      createdAt: new Date().toISOString().split('T')[0]
    };

    setCourses((prev) => [newCourse, ...prev]);
    return newCourse;
  };

  const updateCourseStatus = (courseId, status) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, status } : c))
    );
  };

  const deleteCourse = (courseId) => {
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
  };

  // Actions: Batches
  const addBatch = (batchData, course, instructor) => {
    const maxCap = Math.min(Number(batchData.maxCapacity) || 12, 50); // Hard rule: max 50
    const newBatch = {
      id: `batch-${Date.now()}`,
      courseId: course.id,
      courseTitle: course.title,
      instructorId: instructor.id,
      instructorName: instructor.name,
      ...batchData,
      maxCapacity: maxCap,
      enrolledCount: 0,
      status: 'Upcoming',
      liveClassLink: `/classroom/batch-${Date.now()}`
    };

    setBatches((prev) => [newBatch, ...prev]);

    // Update course active batches count
    setCourses((prev) =>
      prev.map((c) =>
        c.id === course.id
          ? { ...c, activeBatchesCount: (c.activeBatchesCount || 0) + 1 }
          : c
      )
    );

    return newBatch;
  };

  const updateBatch = (batchId, updatedFields) => {
    setBatches((prev) =>
      prev.map((b) => (b.id === batchId ? { ...b, ...updatedFields } : b))
    );
  };

  // Actions: Enrollment & Payment
  const enrollStudent = (student, course, batch, paymentDetails) => {
    // Check capacity rule
    if (batch.enrolledCount >= batch.maxCapacity) {
      return { success: false, error: 'This batch has reached its maximum capacity of 50 students.' };
    }

    const txnId = `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const fee = batch.fee || course.price;
    const platformFee = Number((fee * 0.15).toFixed(2));
    const instructorPayout = Number((fee - platformFee).toFixed(2));

    const newPayment = {
      id: txnId,
      studentId: student.id,
      studentName: student.name,
      courseTitle: course.title,
      batchName: batch.name,
      instructorName: course.instructorName || batch.instructorName,
      instructorId: batch.instructorId,
      amount: fee,
      platformFee,
      instructorPayout,
      method: paymentDetails.method || 'Card / UPI',
      status: 'Completed',
      date: new Date().toISOString(),
      receiptUrl: '#'
    };

    const newEnrollment = {
      id: `enr-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      studentEmail: student.email,
      studentAvatar: student.avatar,
      courseId: course.id,
      courseTitle: course.title,
      batchId: batch.id,
      batchName: batch.name,
      instructorId: batch.instructorId,
      instructorName: batch.instructorName,
      enrolledAt: new Date().toISOString().split('T')[0],
      amountPaid: fee,
      paymentId: txnId,
      paymentStatus: 'Completed',
      progressPercentage: 0,
      attendanceRate: 100,
      nextClass: {
        id: `class-${Date.now()}`,
        title: `Welcome Session: ${batch.name}`,
        date: batch.startDate,
        time: batch.timing,
        status: 'Scheduled',
        joinUrl: `/classroom/${batch.id}`
      }
    };

    // Update state
    setPayments((prev) => [newPayment, ...prev]);
    setEnrollments((prev) => [newEnrollment, ...prev]);
    setBatches((prev) =>
      prev.map((b) =>
        b.id === batch.id ? { ...b, enrolledCount: b.enrolledCount + 1 } : b
      )
    );
    setCourses((prev) =>
      prev.map((c) =>
        c.id === course.id
          ? { ...c, totalEnrolledStudents: (c.totalEnrolledStudents || 0) + 1 }
          : c
      )
    );

    return { success: true, enrollment: newEnrollment, payment: newPayment };
  };

  // Actions: Assignments
  const submitAssignment = (assignmentId, fileData) => {
    setAssignments((prev) =>
      prev.map((asg) =>
        asg.id === assignmentId
          ? {
              ...asg,
              status: 'Submitted',
              submittedFile: fileData.fileName || 'Assignment_Submission.pdf',
              submittedAt: new Date().toISOString().split('T')[0]
            }
          : asg
      )
    );
  };

  // Actions: Instructor Verification & Admin actions
  const updateInstructorVerification = (instructorId, status) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === instructorId ? { ...u, verificationStatus: status } : u
      )
    );
  };

  const submitInstructorApplication = (instructorId, applicationData) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === instructorId) {
          return {
            ...u,
            ...applicationData,
            verificationStatus: 'Pending Review',
            verificationDocuments: [
              { name: 'ID_Proof_Verification.pdf', type: 'Government ID', uploadedAt: new Date().toISOString().split('T')[0], status: 'Pending Review' },
              { name: 'Expertise_Credentials.pdf', type: 'Skill Certificate', uploadedAt: new Date().toISOString().split('T')[0], status: 'Pending Review' }
            ]
          };
        }
        return u;
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        courses,
        batches,
        enrollments,
        liveClasses,
        assignments,
        payments,
        certificates,
        users,
        addCourse,
        updateCourseStatus,
        deleteCourse,
        addBatch,
        updateBatch,
        enrollStudent,
        submitAssignment,
        updateInstructorVerification,
        submitInstructorApplication
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useStore must be used within an AppProvider');
  }
  return context;
};
