import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/Login";
import DashboardPage from "./pages/DashboardPage";
import EventsPage from "./pages/EventsPage";
import ParticipantsPage from "./pages/ParticipantsPage";
import AttendancePage from "./pages/AttendancePage";
import ImportParticipants from "./pages/ImportParticipants";
import ParticipantReport from "./pages/ParticipantReport";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="participants" element={<ParticipantsPage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="import-participants" element={<ImportParticipants />} />
          <Route path="participant-report" element={<ParticipantReport />} />
          {/* Redirect from root to dashboard when authenticated */}
          <Route path="" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
