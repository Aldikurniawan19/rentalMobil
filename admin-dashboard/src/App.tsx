import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './pages/Login';
import Overview from './pages/Overview';
import Cars from './pages/Cars';
import Bookings from './pages/Bookings';
import Content from './pages/Content';
import Settings from './pages/Settings';
import { initializeStorage } from './utils/localStorageHelper';

export default function App() {
  const [adminUser, setAdminUser] = useState<{ username: string; email: string } | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');

  useEffect(() => {
    // Initialize dummy/mock database parameters in localStorage
    initializeStorage();

    // Check active session
    const activeSession = sessionStorage.getItem('kgyk_admin_session');
    if (activeSession) {
      try {
        setAdminUser(JSON.parse(activeSession));
      } catch (err) {
        sessionStorage.removeItem('kgyk_admin_session');
      }
    }
  }, []);

  const handleLoginSuccess = (user: { username: string; email: string }) => {
    setAdminUser(user);
    sessionStorage.setItem('kgyk_admin_session', JSON.stringify(user));
  };

  const handleLogout = () => {
    setAdminUser(null);
    sessionStorage.removeItem('kgyk_admin_session');
  };

  const handleProfileUpdate = (updatedUser: { username: string; email: string }) => {
    setAdminUser(updatedUser);
    sessionStorage.setItem('kgyk_admin_session', JSON.stringify(updatedUser));
  };

  // Render Login page if not authenticated
  if (!adminUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Page switcher
  const renderActivePage = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview onNavigate={setActiveTab} />;
      case 'cars':
        return <Cars />;
      case 'bookings':
        return <Bookings />;
      case 'content':
        return <Content />;
      case 'settings':
        return <Settings adminUser={adminUser} onProfileUpdate={handleProfileUpdate} />;
      default:
        return <Overview onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        adminUser={adminUser}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 pl-68 min-h-screen flex flex-col">
        {/* Header Navigation */}
        <Header activeTab={activeTab} />

        {/* Dynamic Page content wrapper */}
        <main className="flex-1 p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {renderActivePage()}
        </main>
      </div>
    </div>
  );
}
