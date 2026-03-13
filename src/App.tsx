import React from 'react';
import { AppProvider } from './context/AppContext';
import { Navbar, Footer } from './components/Layout';
import { Hero, Services, Products, Team, Gallery, FAQ, Contact } from './components/Sections';
import { AdminPortal } from './components/AdminPortal';

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen">
        <Navbar />
        <main>
          <Hero />
          <Services />
          <Products />
          <Team />
          <Gallery />
          <FAQ />
          <Contact />
          <AdminPortal />
        </main>
        <Footer />
      </div>
    </AppProvider>
  );
}
