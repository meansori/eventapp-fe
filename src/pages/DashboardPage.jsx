import React from "react";
import { useAuthenticatedQuery } from "../hooks/useAuthenticatedQuery";
import api from "../services/api";
import MonthlyCalendar from "../components/dashboard/MonthlyCalendar";
import Statistics from "../components/dashboard/Statistics";

export default function DashboardPage() {
  const now = new Date();

  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
  } = useAuthenticatedQuery(["statistics"], () =>
    api.get(`/absensi/statistics/month/${now.getFullYear()}/${now.getMonth() + 1}`).then((res) => res.data)
  );

  return (
    <div>
      <h1 className="mb-4">Dashboard</h1>

      <div className="row">
        <div className="col-12 mb-4">
          <MonthlyCalendar />
        </div>
        <div className="col-lg-6 mb-4">
          {statsLoading ? (
            <div className="text-center py-5">Loading statistics...</div>
          ) : statsError ? (
            <div className="alert alert-danger">Error loading statistics</div>
          ) : (
            <Statistics stats={stats} />
          )}
        </div>
      </div>
    </div>
  );
}
