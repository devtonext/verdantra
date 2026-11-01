import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { SiteProvider } from './lib/site.jsx';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Contribution from './pages/Contribution.jsx';
import OurMission from './pages/OurMission.jsx';
import Problems from './pages/Problems.jsx';
import Projects from './pages/Projects.jsx';
import Contact from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';

// Lazy-load the Admin Dashboard so website visitors never download it
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'));

export default function App() {
  return (
    <SiteProvider>
      <Routes>
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={<div style={{ padding: 48, textAlign: 'center' }}>Loading Admin Dashboard…</div>}>
              <AdminApp />
            </Suspense>
          }
        />
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="contribution" element={<Contribution />} />
          <Route path="mission" element={<OurMission />} />
          <Route path="problems" element={<Problems />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:slug" element={<Projects />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </SiteProvider>
  );
}
