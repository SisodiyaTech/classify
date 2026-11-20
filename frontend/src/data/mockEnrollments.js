export const mockEnrollments = [
  {
    id: 'enr-101',
    studentId: 'user-student-1',
    studentName: 'Priya Sharma',
    studentEmail: 'priya.sharma@example.com',
    studentAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    courseId: 'course-1',
    courseTitle: 'Artisanal Sourdough & Wild Yeast Masterclass',
    batchId: 'batch-1',
    batchName: 'Weekend Sourdough Morning Cohort #8',
    instructorId: 'user-instructor-1',
    instructorName: 'Dr. Ananya Roy',
    enrolledAt: '2026-11-10',
    amountPaid: 3499,
    paymentId: 'TXN-98432101',
    paymentStatus: 'Completed',
    progressPercentage: 65,
    attendanceRate: 92,
    nextClass: {
      id: 'live-class-1',
      title: 'Session 5: Bulk Fermentation & Tension Shaping',
      date: '2026-11-21',
      time: '10:00 AM - 11:30 AM IST',
      status: 'Scheduled', // Scheduled, Live Now, Completed
      joinUrl: '/classroom/batch-1'
    }
  },
  {
    id: 'enr-102',
    studentId: 'user-student-1',
    studentName: 'Priya Sharma',
    studentEmail: 'priya.sharma@example.com',
    studentAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    courseId: 'course-3',
    courseTitle: 'Modern React & JavaScript for Career Switchers',
    batchId: 'batch-4',
    batchName: 'React FastTrack Cohort Alpha',
    instructorId: 'user-instructor-3',
    instructorName: 'Rohan Varma',
    enrolledAt: '2026-11-12',
    amountPaid: 4999,
    paymentId: 'TXN-98432102',
    paymentStatus: 'Completed',
    progressPercentage: 40,
    attendanceRate: 100,
    nextClass: {
      id: 'live-class-2',
      title: 'Session 3: Mastering Custom Hooks & API Integration',
      date: '2026-11-22',
      time: '08:00 PM - 09:30 PM IST',
      status: 'Scheduled',
      joinUrl: '/classroom/batch-4'
    }
  }
];

export const mockLiveClasses = [
  {
    id: 'live-class-1',
    batchId: 'batch-1',
    courseTitle: 'Artisanal Sourdough & Wild Yeast Masterclass',
    batchName: 'Weekend Sourdough Morning Cohort #8',
    instructorId: 'user-instructor-1',
    instructorName: 'Dr. Ananya Roy',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    title: 'Session 5: Bulk Fermentation & Coil Folds in Real Time',
    date: '2026-11-21',
    time: '10:00 AM - 11:30 AM IST',
    durationMinutes: 90,
    status: 'Scheduled',
    agenda: 'We will bring our fermented dough to the camera and demonstrate tension building.',
    materialsNeeded: ['Fermenting dough in glass bowl', 'Water spray bottle', 'Bench scraper'],
    participantsCount: 10
  },
  {
    id: 'live-class-demo-active',
    batchId: 'batch-1',
    courseTitle: 'Artisanal Sourdough & Wild Yeast Masterclass',
    batchName: 'Weekend Sourdough Morning Cohort #8',
    instructorId: 'user-instructor-1',
    instructorName: 'Dr. Ananya Roy',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    title: 'Live Lab: Starter Feeding & Hydration Workshop',
    date: 'Today',
    time: 'Live Now',
    durationMinutes: 90,
    status: 'Live Now', // Clickable directly to classroom!
    agenda: 'Interactive crumb critique and flour protein discussion.',
    materialsNeeded: ['Active starter jar', 'Kitchen scale', 'Flour & warm water'],
    participantsCount: 9
  },
  {
    id: 'live-class-2',
    batchId: 'batch-4',
    courseTitle: 'Modern React & JavaScript for Career Switchers',
    batchName: 'React FastTrack Cohort Alpha',
    instructorId: 'user-instructor-3',
    instructorName: 'Rohan Varma',
    instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Session 3: Mastering Custom Hooks & API Integration',
    date: '2026-11-22',
    time: '08:00 PM - 09:30 PM IST',
    durationMinutes: 90,
    status: 'Scheduled',
    agenda: 'Build a weather app using useEffect and custom hook abstraction.',
    materialsNeeded: ['VS Code', 'GitHub repository cloned'],
    participantsCount: 13
  },
  {
    id: 'live-class-completed-1',
    batchId: 'batch-1',
    courseTitle: 'Artisanal Sourdough & Wild Yeast Masterclass',
    batchName: 'Weekend Sourdough Morning Cohort #8',
    instructorId: 'user-instructor-1',
    instructorName: 'Dr. Ananya Roy',
    title: 'Session 4: Autolyse Math & Flour Protein Analysis',
    date: '2026-11-14',
    time: '10:00 AM - 11:30 AM IST',
    durationMinutes: 90,
    status: 'Completed',
    attendance: 'Present',
    recordingUrl: '#'
  }
];

export const mockAssignments = [
  {
    id: 'asg-1',
    courseId: 'course-1',
    courseTitle: 'Artisanal Sourdough & Wild Yeast Masterclass',
    batchId: 'batch-1',
    batchName: 'Weekend Sourdough Morning Cohort #8',
    title: 'Starter Activity Log & Windowpane Video Submission',
    dueDate: '2026-11-23',
    status: 'Pending', // Pending, Submitted, Graded
    description: 'Record a short 30-second clip demonstrating your dough passing the gluten windowpane test. Upload your flour hydration sheet.',
    points: 100,
    submission: null
  },
  {
    id: 'asg-2',
    courseId: 'course-1',
    courseTitle: 'Artisanal Sourdough & Wild Yeast Masterclass',
    batchId: 'batch-1',
    batchName: 'Weekend Sourdough Morning Cohort #8',
    title: 'Sourdough Starter 7-Day Rise Observation Chart',
    dueDate: '2026-11-15',
    status: 'Graded',
    description: 'Document your starter rise volume at 24C temperature across 7 days.',
    points: 100,
    grade: '96 / 100',
    feedback: 'Fantastic rise vigor! Your yeast microbiome is healthy and ready for cold bulk retard.',
    submittedFile: 'Priya_Starter_Log_Week1.pdf',
    submittedAt: '2026-11-14'
  },
  {
    id: 'asg-3',
    courseId: 'course-3',
    courseTitle: 'Modern React & JavaScript for Career Switchers',
    batchId: 'batch-4',
    batchName: 'React FastTrack Cohort Alpha',
    title: 'Interactive Filterable Product Catalog with React Hooks',
    dueDate: '2026-11-24',
    status: 'Pending',
    description: 'Submit your GitHub repository link and deployed Netlify demo url.',
    points: 100,
    submission: null
  }
];

export const mockCertificates = [
  {
    id: 'cert-7801',
    studentId: 'user-student-1',
    studentName: 'Priya Sharma',
    courseTitle: 'Culinary Fundamentals & Fermentation Science',
    instructorName: 'Dr. Ananya Roy',
    issueDate: '2026-10-15',
    credentialId: 'CLS-2026-89410',
    certificateUrl: '#',
    grade: 'Distinction (96%)'
  }
];

export const mockPayments = [
  {
    id: 'TXN-98432101',
    studentId: 'user-student-1',
    studentName: 'Priya Sharma',
    courseTitle: 'Artisanal Sourdough & Wild Yeast Masterclass',
    batchName: 'Weekend Sourdough Morning Cohort #8',
    instructorName: 'Dr. Ananya Roy',
    instructorId: 'user-instructor-1',
    amount: 3499,
    platformFee: 524.85, // 15% platform commission
    instructorPayout: 2974.15,
    method: 'UPI / Razorpay',
    status: 'Completed', // Completed, Refunded, Pending
    date: '2026-11-10T14:32:00Z',
    receiptUrl: '#'
  },
  {
    id: 'TXN-98432102',
    studentId: 'user-student-1',
    studentName: 'Priya Sharma',
    courseTitle: 'Modern React & JavaScript for Career Switchers',
    batchName: 'React FastTrack Cohort Alpha',
    instructorName: 'Rohan Varma',
    instructorId: 'user-instructor-3',
    amount: 4999,
    platformFee: 749.85,
    instructorPayout: 4249.15,
    method: 'Credit Card',
    status: 'Completed',
    date: '2026-11-12T19:04:00Z',
    receiptUrl: '#'
  },
  {
    id: 'TXN-98432098',
    studentId: 'user-student-2',
    studentName: 'Kavita Joshi',
    courseTitle: 'Madhubani & Mithila Folk Painting Immersion',
    batchName: 'Heritage Art Afternoon Batch',
    instructorName: 'Sunita Deshmukh',
    instructorId: 'user-instructor-2',
    amount: 2499,
    platformFee: 374.85,
    instructorPayout: 2124.15,
    method: 'Net Banking',
    status: 'Completed',
    date: '2026-11-08T11:20:00Z',
    receiptUrl: '#'
  }
];

export const mockReviews = [
  {
    id: 'rev-1',
    courseId: 'course-1',
    studentName: 'Meera Nambiar',
    studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    date: '3 days ago',
    comment: 'The 12-student cap is a game changer! Dr. Ananya literally asked me to tilt my webcam toward my mixing bowl and told me my starter needed 15% more water. My sourdough finally has that airy, custardy crumb!'
  },
  {
    id: 'rev-2',
    courseId: 'course-1',
    studentName: 'Amit Saxena',
    studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    date: '1 week ago',
    comment: 'Worth every single rupee. No recorded course can replace live troubleshooting when your dough refuses to hold shape.'
  },
  {
    id: 'rev-3',
    courseId: 'course-2',
    studentName: 'Pooja Hegde',
    studentAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    date: '2 weeks ago',
    comment: 'Sunita Maam is so patient and encouraging. Teaching traditional art online requires real care, and she looked at every student pen stroke.'
  }
];
