import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/transactions', label: 'Txn Log' },
  { path: '/cases', label: 'Cases' },
  { path: '/federated', label: 'Federated Intel' },
  { path: '/entities', label: 'Entity Resolution' },
  { path: '/risk', label: 'Risk Scoring' },
  { path: '/redteam', label: 'Red Team' },
  { path: '/compliance', label: 'Compliance' },
];

export const Navbar: React.FC = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: false }));
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="sticky top-0 z-50 -mx-4 -mt-4 mb-6 border-b border-border-subtle bg-bg-panel/85 backdrop-blur-xl saturate-150">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 text-[1.1rem] font-bold tracking-tight text-text-primary hover:opacity-80">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-ai text-[0.9rem]">
            🕸️
          </div>
          Mule<span className="text-primary">Net</span>
          <span className="ml-1 rounded-md bg-primary/15 px-1.5 py-0.5 text-[0.55rem] font-bold uppercase tracking-widest text-primary">v3.0</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map(link => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`rounded-lg px-3 py-1.5 text-[0.72rem] font-medium transition-all duration-200 ${isActive
                  ? 'bg-primary/15 text-primary'
                  : 'text-text-secondary hover:bg-bg-card-hover hover:text-text-primary'
                  }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Status Bar */}
        <div className="hidden md:flex items-center gap-4 text-[0.7rem] text-text-secondary">
          <span className="flex items-center">
            <span className="animate-nav-pulse mr-1.5 inline-block h-[7px] w-[7px] rounded-full bg-success"></span>
            System Active
          </span>
          <span className="text-text-muted">|</span>
          <span>🕐 {time} IST</span>
          <span className="text-text-muted">|</span>
          <span>Models: Online</span>
          <span className="text-text-muted">|</span>
          <span>Agent: Tejas</span>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="lg:hidden rounded-lg p-1.5 text-text-secondary hover:bg-bg-card-hover hover:text-text-primary"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border-subtle lg:hidden"
          >
            <nav className="flex flex-col gap-1 px-4 py-3">
              {navLinks.map(link => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${isActive
                      ? 'bg-primary/15 text-primary'
                      : 'text-text-secondary hover:bg-bg-card-hover hover:text-text-primary'
                      }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
