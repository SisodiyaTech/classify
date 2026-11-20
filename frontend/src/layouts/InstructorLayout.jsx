import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Sidebar from '../components/navigation/Sidebar';
import DemoRoleSwitcher from '../components/navigation/DemoRoleSwitcher';

export const InstructorLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <Sidebar role="instructor" />
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
      <DemoRoleSwitcher />
    </div>
  );
};

export default InstructorLayout;
