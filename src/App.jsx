import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Projects from './pages/Projects';
import Team from './pages/Team';
import Admin from './pages/Admin';
import Contact from './pages/Contact';

// About Page Placeholder - Simple enough to keep here or move if needed, but for now moving it to a simple inline or new file. 
// Let's keep it inline for simplicity as it wasn't explicitly complex in the plan, or just reuse the structure.
// Actually, I'll create a quick About page content here to match the style.

import About from './pages/About';
import Gallery from './pages/Gallery';
import Alumni from './pages/Alumni';

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
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
      </Routes>
    </Layout>
  );
}

export default App;
