import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/AppContext';
import { 
  Search, 
  Sparkles, 
  Users, 
  Video, 
  Award, 
  CheckCircle, 
  ChevronRight, 
  ArrowRight, 
  Star, 
  HelpCircle,
  Clock,
  ShieldCheck,
  ChevronDown,
  ChefHat,
  Palette,
  Code,
  Languages,
  TrendingUp,
  Heart
} from 'lucide-react';
import { mockCategories } from '../../data/mockCourses';
import { mockUsers } from '../../data/mockUsers';
import CourseCard from '../../components/cards/CourseCard';
import InstructorCard from '../../components/cards/InstructorCard';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export const HomePage = () => {
  const { courses, batches } = useStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const approvedCourses = courses.filter((c) => c.status === 'Approved');
  const instructors = mockUsers.filter((u) => u.role === 'instructor');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/courses');
    }
  };

  const faqs = [
    {
      q: 'How are Classify cohorts different from pre-recorded video courses?',
      a: 'Pre-recorded platforms have less than an 8% completion rate because you learn alone. On Classify, all courses are conducted via live interactive video classes in small cohorts strictly capped at 10 to 15 students. The instructor sees your work in real time, answers your specific questions, and holds you accountable.'
    },
    {
      q: 'Who can become an instructor on Classify?',
      a: 'Anyone with genuine, practical expertise! We actively empower homemakers, artisanal sourdough bakers, folk artists, freelance developers, language speakers, and retired craftspeople. Before teaching, instructors complete identity and credential verification to ensure student safety.'
    },
    {
      q: 'What is the maximum number of students allowed in a batch?',
      a: 'Classify has a strict platform rule: no batch can exceed 50 students, and our recommended cohort size is 10–15 students. This ensures instructors can devote personal attention to every single student.'
    },
    {
      q: 'What happens if I miss a scheduled live class?',
      a: 'Every live session is recorded and uploaded to your Student Hub within 24 hours. You can review the video and ask the instructor questions in the cohort discussion forum.'
    },
    {
      q: 'Is there a refund policy if a cohort is not right for me?',
      a: 'Yes. If you attend the first live class and feel the cohort does not match your expectations, you can request a 100% refund before the second session begins.'
    }
  ];

  return (
    <div className="space-y-20 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-edge bg-gradient-to-b from-brand-50/60 via-surface to-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Value Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100 text-brand-800 text-xs font-semibold border border-brand-200 shadow-subtle animate-in fade-in duration-300">
              <Sparkles className="w-4 h-4 text-accent-dark" />
              <span>Small-Batch Live Coaching • Strictly Capped at 15 Students</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-brand-900 leading-[1.12]">
              Learn New Skills. <br className="hidden sm:inline" />
              <span className="text-brand-500">Teach What You Know.</span>
            </h1>

            {/* Supporting text */}
            <p className="text-base sm:text-lg text-content-body max-w-2xl mx-auto leading-relaxed">
              Join a community where anyone can share knowledge, earn by teaching, and learn through interactive small-group live classes with genuine personal attention.
            </p>

            {/* Live Search Bar */}
            <form onSubmit={handleSearch} className="pt-2 max-w-xl mx-auto">
              <div className="relative flex items-center bg-white rounded-2xl border border-edge shadow-card p-1.5 hover:border-brand-400 transition-all focus-within:ring-2 focus-within:ring-brand-500/20">
                <Search className="w-5 h-5 text-gray-400 ml-3.5 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search live batches: sourdough, madhubani, react..."
                  className="w-full bg-transparent border-none px-3 py-2.5 text-sm text-brand-900 placeholder:text-gray-400 focus:outline-none"
                />
                <Button type="submit" variant="primary" size="md" className="shrink-0">
                  Find Classes
                </Button>
              </div>
            </form>

            {/* CTAs & Social Proof */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link to="/courses">
                <Button variant="primary" size="lg" iconRight={ArrowRight}>
                  Explore Classes
                </Button>
              </Link>
              <Link to="/register?role=instructor">
                <Button variant="outline" size="lg">
                  Become an Instructor
                </Button>
              </Link>
            </div>

            {/* Mini Trust Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 text-center">
              <div className="p-3 rounded-xl bg-white border border-edge shadow-subtle">
                <p className="text-xl font-bold text-brand-900">10-15</p>
                <p className="text-[11px] text-content-muted">Avg Students / Batch</p>
              </div>
              <div className="p-3 rounded-xl bg-white border border-edge shadow-subtle">
                <p className="text-xl font-bold text-brand-900">100%</p>
                <p className="text-[11px] text-content-muted">Live Video Classes</p>
              </div>
              <div className="p-3 rounded-xl bg-white border border-edge shadow-subtle">
                <p className="text-xl font-bold text-brand-900">4.92 ★</p>
                <p className="text-[11px] text-content-muted">Learner Satisfaction</p>
              </div>
              <div className="p-3 rounded-xl bg-white border border-edge shadow-subtle">
                <p className="text-xl font-bold text-brand-900">₹3.8L+</p>
                <p className="text-[11px] text-content-muted">Avg Instructor Payout</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Shelf */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-brand-900">Explore Learning Categories</h2>
            <p className="text-sm text-content-muted mt-1">
              Practical crafts, creative arts, and vocational skills taught by verified practitioners.
            </p>
          </div>
          <Link to="/courses" className="text-xs font-semibold text-brand-600 hover:text-brand-900 flex items-center gap-1">
            Browse All ({courses.length}) <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
          {mockCategories.map((cat) => (
            <Link
              key={cat.id}
              to={`/courses?category=${cat.id}`}
              className="group p-5 rounded-2xl bg-white border border-edge hover:border-brand-300 shadow-subtle hover:shadow-card transition-all flex items-start gap-3.5"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${cat.color} group-hover:scale-105 transition-transform`}>
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-brand-900 group-hover:text-brand-600 transition truncate">
                  {cat.name}
                </h4>
                <p className="text-xs text-content-muted mt-0.5">{cat.count} Live Batches</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Small-Batch Courses */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <Badge variant="accent" size="sm" className="mb-2">
              Upcoming Small Cohorts
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-900">
              Popular Small-Batch Classes
            </h2>
            <p className="text-sm text-content-muted mt-1">
              Reserve your seat before capacity fills. Maximum 15 learners per session.
            </p>
          </div>
          <Link to="/courses" className="text-xs font-semibold text-brand-600 hover:text-brand-900 flex items-center gap-1">
            See all batches <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {approvedCourses.slice(0, 6).map((course) => (
            <CourseCard key={course.id} course={course} batches={batches} />
          ))}
        </div>
      </section>

      {/* How Small-Batch Learning Works */}
      <section id="how-it-works" className="bg-white border-y border-edge py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="brand" size="sm" className="mb-2">
              The Classify Model
            </Badge>
            <h2 className="text-3xl font-bold text-brand-900">
              How Small-Batch Learning Works
            </h2>
            <p className="text-sm text-content-muted mt-2">
              Say goodbye to lonely recorded videos. Learn shoulder-to-shoulder with fellow students and an expert.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-surface-subtle border border-edge relative group hover:border-brand-300 transition">
              <span className="text-4xl font-extrabold text-brand-200 block mb-4">01</span>
              <h3 className="text-lg font-semibold text-brand-900 mb-2">Pick an Intimate Cohort</h3>
              <p className="text-xs text-content-muted leading-relaxed">
                Choose a schedule that suits your routine. Cohorts are strictly capped at 10 to 15 students so you're never just a number in a 500-person webinar.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-surface-subtle border border-edge relative group hover:border-brand-300 transition">
              <span className="text-4xl font-extrabold text-brand-200 block mb-4">02</span>
              <h3 className="text-lg font-semibold text-brand-900 mb-2">Live Two-Way Video Classes</h3>
              <p className="text-xs text-content-muted leading-relaxed">
                Position your camera, ask questions openly, and get real-time feedback on your brush strokes, dough tension, or code logic as you practice.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-surface-subtle border border-edge relative group hover:border-brand-300 transition">
              <span className="text-4xl font-extrabold text-brand-200 block mb-4">03</span>
              <h3 className="text-lg font-semibold text-brand-900 mb-2">Mastery & Certificate</h3>
              <p className="text-xs text-content-muted leading-relaxed">
                Submit assignments for personalized audio-video critique, build a portfolio of tangible outcomes, and earn an instructor-verified credential.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison: Small-Batch vs Traditional Recorded MOOCs */}
      <section id="benefits" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-brand-900 text-white relative overflow-hidden">
          <div className="max-w-2xl mb-10">
            <Badge variant="accent" size="sm" className="mb-3">
              Why We Cap Batches
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Why Small-Batch Learning Beats Recorded Videos
            </h2>
            <p className="text-sm text-gray-300 mt-2 leading-relaxed">
              Real learning requires active conversation, immediate error correction, and mutual accountability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-brand-800/80 border border-brand-700">
              <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm mb-3">
                <span>✕ Traditional Recorded Platforms</span>
              </div>
              <ul className="space-y-2.5 text-xs text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>Less than 8% course completion rate; massive dropout</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>No one to answer why your specific bread won't rise or code fails</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>Zero human connection or camaraderie with fellow students</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-brand-950 border border-brand-500/50 shadow-elevated">
              <div className="flex items-center gap-2 text-accent font-semibold text-sm mb-3">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>The Classify Small-Batch Advantage</span>
              </div>
              <ul className="space-y-2.5 text-xs text-gray-200">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>92%+ completion rate</strong> driven by live peer momentum</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Live camera critique: show your dough, painting, or code in real time</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Max 50 students platform rule; default 10-15 recommended cohort</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Instructors */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-900">
              Learn from Verified Instructors
            </h2>
            <p className="text-sm text-content-muted mt-1">
              Passionate homemakers, master artisans, and professionals who love personal mentoring.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {instructors.map((inst) => (
            <InstructorCard key={inst.id} instructor={inst} />
          ))}
        </div>
      </section>

      {/* Become an Instructor Callout (Focus on Homemakers & Skilled Individuals) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-surface-subtle border border-edge flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-light text-accent-dark text-xs font-semibold">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              <span>Earn ₹40,000–₹1,50,000 / month from home</span>
            </div>
            <h2 className="text-3xl font-bold text-brand-900">
              Have a skill? Turn your passion into a live coaching cohort.
            </h2>
            <p className="text-sm text-content-body leading-relaxed">
              Whether you are an expert sourdough baker, traditional artist, coder, or fluent language speaker, Classify handles registrations, batch scheduling, payments, and live video rooms. You teach what you love to 10–15 students at a time.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link to="/register?role=instructor">
                <Button variant="primary" size="lg" iconRight={Sparkles}>
                  Apply to Teach on Classify
                </Button>
              </Link>
            </div>
          </div>

          <div className="w-full lg:w-96 rounded-2xl overflow-hidden border border-edge bg-white shadow-elevated p-6 space-y-4">
            <h4 className="text-sm font-bold text-brand-900">Batch Revenue Potential</h4>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-edge">
                <span className="text-content-muted">Batch Size:</span>
                <span className="font-semibold text-brand-900">12 Students</span>
              </div>
              <div className="flex justify-between py-2 border-b border-edge">
                <span className="text-content-muted">Tuition per Student:</span>
                <span className="font-semibold text-brand-900">₹3,499</span>
              </div>
              <div className="flex justify-between py-2 border-b border-edge">
                <span className="text-content-muted">Gross Cohort Revenue:</span>
                <span className="font-semibold text-brand-900">₹41,988</span>
              </div>
              <div className="flex justify-between pt-1 text-sm font-bold text-brand-700">
                <span>Your Payout (85%):</span>
                <span>₹35,689 / cohort</span>
              </div>
            </div>
            <p className="text-[10px] text-content-muted leading-relaxed">
              *Teach 2 weekend batches a month to earn over ₹70,000 with 6 hours of live teaching per week.
            </p>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <Badge variant="brand" size="sm" className="mb-2">
            Got Questions?
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-edge bg-white overflow-hidden transition shadow-subtle"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-brand-900 text-sm hover:text-brand-600 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-content-muted leading-relaxed border-t border-edge/50 pt-3 animate-in fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
