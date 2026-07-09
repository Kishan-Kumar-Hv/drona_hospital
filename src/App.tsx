import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { BookingPage } from './pages/BookingPage';
import { MyAppointmentsPage } from './pages/MyAppointmentsPage';
import { TokenBookingPage } from './pages/TokenBookingPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostDetailPage } from './pages/BlogPostDetailPage';
import { GalleryPage } from './pages/GalleryPage';
import { ReceptionLoginPage } from './pages/reception/ReceptionLoginPage';
import { ReceptionDashboardPage } from './pages/reception/ReceptionDashboardPage';
import { ContentManagerPage } from './pages/reception/ContentManagerPage';
import { TokenManagerPage } from './pages/reception/TokenManagerPage';
import { ReceptionBookingPage } from './pages/reception/ReceptionBookingPage';
import { ProtectedRoute } from './components/reception/ProtectedRoute';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/book" element={<BookingPage />} />
          <Route path="/my-appointments" element={<MyAppointmentsPage />} />
          <Route path="/token" element={<TokenBookingPage />} />
          <Route path="/services/:serviceId" element={<ServiceDetailPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:postId" element={<BlogPostDetailPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/reception/login" element={<ReceptionLoginPage />} />
          <Route
            path="/reception/dashboard"
            element={
              <ProtectedRoute>
                <ReceptionDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reception/content"
            element={
              <ProtectedRoute>
                <ContentManagerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reception/tokens"
            element={
              <ProtectedRoute>
                <TokenManagerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reception/book"
            element={
              <ProtectedRoute>
                <ReceptionBookingPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
