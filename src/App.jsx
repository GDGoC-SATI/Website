import React, { useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Projects from './pages/Projects';
import Team from './pages/Team';
import Admin from './pages/Admin';
import Contact from './pages/Contact';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Alumni from './pages/Alumni';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';

function App() {
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const elem = document.getElementById(id);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    // Only scroll to top on actual route change, preserving scroll position on page refresh
    if (prevPathRef.current !== location.pathname) {
      prevPathRef.current = location.pathname;
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  return (
    <AuthProvider>
      <NotificationProvider>
        <ToastProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/team" element={<Team />} />
              <Route path="/alumni" element={<Alumni />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/about" element={<About />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/:username" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/notifications" element={<Notifications />} />
            </Routes>
          </Layout>
        </ToastProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
