import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import EventTypesPage from './pages/admin/EventTypesPage';
import EventTypeEditPage from './pages/admin/EventTypeEditPage';
import AvailabilityPage from './pages/admin/AvailabilityPage';
import AvailabilityDetailPage from './pages/admin/AvailabilityDetailPage';
import BookingsPage from './pages/admin/BookingsPage';
import BookingPage from './pages/public/BookingPage';
import ConfirmationPage from './pages/public/ConfirmationPage';
import PublicProfilePage from './pages/public/PublicProfilePage';

import LandingPage from './pages/public/LandingPage';

function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4 text-white">
      <h1 className="text-2xl font-bold tracking-tight">Page not found</h1>
      <p className="mt-2 text-sm text-zinc-500 font-medium">
        The page you are looking for does not exist.
      </p>
      <a
        href="/admin/availability"
        className="mt-6 rounded-lg bg-white px-4 py-2 text-sm font-bold text-black shadow-sm hover:bg-zinc-200 transition-all"
      >
        Go Home
      </a>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/admin',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <Navigate to="availability" replace />,
      },
      {
        path: 'event-types',
        element: <EventTypesPage />,
        handle: { title: 'Event Types' },
      },
      {
        path: 'event-types/:id',
        element: <EventTypeEditPage />,
        handle: { title: 'Edit Event Type' },
      },
      {
        path: 'availability',
        element: <AvailabilityPage />,
        handle: { title: 'Availability' },
      },
      {
        path: 'availability/:id',
        element: <AvailabilityDetailPage />,
        handle: { title: 'Edit Availability' },
      },
      {
        path: 'bookings',
        element: <BookingsPage />,
        handle: { title: 'Bookings' },
      },
    ],
  },
  {
    path: '/u/:username',
    element: <PublicProfilePage />,
  },
  {
    path: '/book/:slug',
    element: <BookingPage />,
  },
  {
    path: '/confirm/:uid',
    element: <ConfirmationPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default router;

