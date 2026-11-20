import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';
import DemoRoleSwitcher from '../components/navigation/DemoRoleSwitcher';

export const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <DemoRoleSwitcher />
    </div>
  );
};

export default PublicLayout;
