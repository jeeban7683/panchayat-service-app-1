import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';

const PublicLayout = () => (
  <div className="min-h-screen flex flex-col bg-[#F5F3FF]">
    <Navbar />
    <main className="flex-grow">
      <Outlet />
    </main>
    <div className="relative z-10">
      <Footer />
    </div>
  </div>
);

export default PublicLayout;

