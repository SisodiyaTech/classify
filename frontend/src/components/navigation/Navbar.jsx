import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  GraduationCap, 
  Menu, 
  X, 
  Compass, 
  Sparkles, 
  User, 
  LogOut, 
  LayoutDashboard, 
  ChevronDown,
  BookOpen
} from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';

export const Navbar = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const getDashboardPath = () => {
    if (role === 'student') return '/student/overview';
    if (role === 'instructor') return '/instructor/overview';
    if (role === 'admin') return '/admin/overview';
    return '/';
  };

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-edge transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center shadow-subtle group-hover:bg-brand-600 transition-colors">
              <GraduationCap className="w-6 h-6 text-accent" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-brand-900 block leading-tight">
                Classify
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-brand-500 block -mt-0.5">
                Live Small Batches
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/courses"
              className={`text-sm font-medium transition ${
                location.pathname.startsWith('/courses')
                  ? 'text-brand-600 font-semibold'
                  : 'text-content-body hover:text-brand-900'
              }`}
            >
              Explore Classes
            </Link>
            <a
              href="/#how-it-works"
              className="text-sm font-medium text-content-body hover:text-brand-900 transition"
            >
              How It Works
            </a>
            <a
              href="/#benefits"
              className="text-sm font-medium text-content-body hover:text-brand-900 transition"
            >
              Small-Batch Advantage
            </a>
            <Link
              to="/register?role=instructor"
              className="text-sm font-medium text-brand-700 hover:text-brand-900 flex items-center gap-1 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-accent-dark" />
              <span>Teach on Classify</span>
            </Link>
          </nav>

          {/* Auth / Profile Area */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <Link to={getDashboardPath()}>
                  <Button variant="outline" size="sm" icon={LayoutDashboard}>
                    Dashboard
                  </Button>
                </Link>

                {/* Profile menu */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-surface-subtle transition focus:outline-none"
                  >
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                      alt={user.name}
                      className="w-9 h-9 rounded-xl object-cover ring-2 ring-brand-100"
                    />
                    <div className="text-left hidden lg:block">
                      <p className="text-xs font-semibold text-brand-900 leading-tight">
                        {user.name.split(' ')[0]}
                      </p>
                      <span className="text-[10px] text-brand-600 font-medium capitalize">
                        {user.role}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>

                  {/* Dropdown */}
                  {profileDropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-elevated border border-edge py-2 animate-in fade-in-50 zoom-in-95 duration-150"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-edge mb-1">
                        <p className="text-sm font-semibold text-brand-900">{user.name}</p>
                        <p className="text-xs text-content-muted truncate">{user.email}</p>
                        <Badge variant="brand" size="sm" className="mt-1 capitalize">
                          {user.role}
                        </Badge>
                      </div>

                      <Link
                        to={getDashboardPath()}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-brand-900 hover:bg-surface-subtle transition"
                      >
                        <LayoutDashboard className="w-4 h-4 text-brand-600" />
                        My Dashboard
                      </Link>

                      <Link
                        to={`/${user.role}/profile`}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-brand-900 hover:bg-surface-subtle transition"
                      >
                        <User className="w-4 h-4 text-brand-600" />
                        My Profile
                      </Link>

                      <div className="border-t border-edge my-1" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-600 hover:text-brand-900 hover:bg-surface-subtle transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-edge bg-white px-4 pt-4 pb-6 space-y-4 animate-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-2">
            <Link
              to="/courses"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-brand-900 hover:bg-surface-subtle"
            >
              <Compass className="w-4 h-4 text-brand-500" />
              Explore Classes
            </Link>
            <a
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-brand-900 hover:bg-surface-subtle"
            >
              <BookOpen className="w-4 h-4 text-brand-500" />
              How It Works
            </a>
            <Link
              to="/register?role=instructor"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-brand-700 bg-brand-50/70"
            >
              <Sparkles className="w-4 h-4 text-accent" />
              Teach on Classify
            </Link>
          </nav>

          <div className="pt-4 border-t border-edge">
            {user ? (
              <div className="space-y-2">
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full"
                >
                  <Button variant="primary" size="sm" className="w-full" icon={LayoutDashboard}>
                    Open {user.role} Dashboard
                  </Button>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl"
                >
                  Sign Out ({user.name})
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">
                    Log In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
