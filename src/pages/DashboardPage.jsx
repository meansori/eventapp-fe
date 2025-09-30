import React, { useState } from "react";
import { useAuthenticatedQuery } from "../hooks/useAuthenticatedQuery";
import api from "../services/api";
import MonthlyCalendar from "../components/dashboard/MonthlyCalendar";
import Statistics from "../components/dashboard/Statistics";
import EventStatistics from "../components/dashboard/EventStatistics";

export default function DashboardPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth() + 1;

  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
  } = useAuthenticatedQuery(["statistics", year, month], () => api.get(`/absensi/statistics/month/${year}/${month}`).then((res) => res.data));

  return (
    <div>
      <h1 className="mb-4">Dashboard</h1>

      <EventStatistics year={year} month={month} />

      <div className="row">
        <div className="col-12 mb-4">
          <MonthlyCalendar currentMonth={currentMonth} onMonthChange={setCurrentMonth} />
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
