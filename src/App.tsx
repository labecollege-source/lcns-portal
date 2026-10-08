import React, { useState, useEffect } from 'react';
import { CollegeProvider, useCollege } from "./context/CollegeContext";
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { AppRoutes } from './routes/AppRoutes';
import { LoadingScreen } from './components/common/LoadingScreen';

function AppContent() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <AppRoutes />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <CollegeProvider>
      <AppContent />
    </CollegeProvider>
  );
}

export default App;
