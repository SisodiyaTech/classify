import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Sparkles, Heart, Shield, Users, Video } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-brand-900 text-white border-t border-brand-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-500 text-white flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-accent" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Classify</span>
            </Link>
            <p className="text-sm text-gray-300 max-w-sm leading-relaxed">
              The premier small-batch live learning marketplace. We empower skilled individuals, homemakers, and craft masters to teach live, while giving students real personal attention.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-gray-300">
              <span className="flex items-center gap-1.5 bg-brand-800/80 px-2.5 py-1 rounded-lg border border-brand-700">
                <Users className="w-3.5 h-3.5 text-accent" /> Capped at 15/Batch
              </span>
              <span className="flex items-center gap-1.5 bg-brand-800/80 px-2.5 py-1 rounded-lg border border-brand-700">
                <Video className="w-3.5 h-3.5 text-accent" /> 100% Live & Interactive
              </span>
            </div>
          </div>

          {/* Learn */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-accent mb-4">
              Explore Learning
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li><Link to="/courses?category=culinary" className="hover:text-white transition">Baking & Culinary</Link></li>
              <li><Link to="/courses?category=arts-crafts" className="hover:text-white transition">Folk Arts & Crafts</Link></li>
              <li><Link to="/courses?category=coding-tech" className="hover:text-white transition">Beginner Tech & Coding</Link></li>
              <li><Link to="/courses?category=languages" className="hover:text-white transition">Spoken Languages & Accent</Link></li>
              <li><Link to="/courses?category=wellness" className="hover:text-white transition">Breathwork & Yoga</Link></li>
              <li><Link to="/courses" className="hover:text-white transition font-semibold text-accent">All Small Batches →</Link></li>
            </ul>
          </div>

          {/* Teach */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-accent mb-4">
              Teach & Earn
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li><Link to="/register?role=instructor" className="hover:text-white transition">Become an Instructor</Link></li>
              <li><Link to="/instructor/verification" className="hover:text-white transition">Instructor Verification</Link></li>
              <li><a href="#benefits" className="hover:text-white transition">Batch Economics</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition">How Small Batches Work</a></li>
              <li><Link to="/instructor/earnings" className="hover:text-white transition">Payout Calculator</Link></li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-accent mb-4">
              Trust & Support
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li><span className="text-gray-400">Classroom Code of Conduct</span></li>
              <li><span className="text-gray-400">Batch Refund Policy</span></li>
              <li><span className="text-gray-400">Student Attendance Guarantee</span></li>
              <li><Link to="/admin/overview" className="text-gray-400 hover:text-white transition">Admin Portal Demo</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-brand-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© 2026 Classify EdTech Marketplace. Built for human-to-human small-group education.</p>
          <div className="flex items-center gap-1 text-gray-400">
            <span>Designed with care for creators & lifelong students</span>
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 ml-1" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
