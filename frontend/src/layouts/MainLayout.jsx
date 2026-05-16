import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function MainLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background text-text-main flex flex-col font-sans">
      <header className="border-b border-border bg-surface sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-black tracking-tighter text-primary">
            DEVDUEL
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/battles" className="nav-link">Battles</Link>
            <Link to="/leaderboard" className="nav-link">Leaderboard</Link>
            <Link to="/git-battles" className="nav-link">Git Battles</Link>
            <Link to="/practice" className="nav-link">Practice</Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard" className="text-text-secondary font-medium hover:text-text-main transition-colors">
                  {user.username || 'Profile'}
                </Link>
                <button onClick={logout} className="btn-secondary py-1.5 px-4 text-sm">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary py-1.5 px-4 text-sm">Log In</Link>
                <Link to="/register" className="btn-primary py-1.5 px-4 text-sm">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex-1 w-full mx-auto pb-8">
        <Outlet />
      </main>
    </div>
  );
}
