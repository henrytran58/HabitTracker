import React, { useEffect, useState } from "react";
import HabitStatsCard from "./HabitStatsCard";
import { useNavigate } from "react-router-dom";

const GoBackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/habits")}
      className="text-gray-400 hover:text-gray-900 font-semibold text-xl flex items-center space-x-2 pb-4"
    >
      <span>&larr;</span>
      <span>Go back</span>
    </button>
  );
};

const StreakPage = () => {
  const [summary, setSummary] = useState([]);

  //styling
  useEffect(() => {
    const fetchSummary = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://127.0.0.1:5000/api/habit_logs/summary",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setSummary(data.summary); // should be an array of habits with logs
    };

    fetchSummary();
  }, []);
  // const mockSummary = [
  //   {
  //     habit_id: 1,
  //     habit_name: "Drink Water",
  //     current_streak: 3,
  //     longest_streak: 7,
  //     started_date: "2025-06-01",
  //     total_count: 15,
  //     logs: [
  //       { date: "2025-06-01", count: 1 },
  //       { date: "2025-06-02", count: 1 },
  //       { date: "2025-06-03", count: 1 },
  //       { date: "2025-06-04", count: 1 },
  //       { date: "2025-06-05", count: 1 },
  //       { date: "2025-06-06", count: 1 },
  //       { date: "2025-06-07", count: 1 },
  //       { date: "2025-06-08", count: 1 },
  //       { date: "2025-06-09", count: 1 },
  //       { date: "2025-06-10", count: 1 },
  //       { date: "2025-06-11", count: 1 },
  //       { date: "2025-06-12", count: 1 },
  //       { date: "2025-06-13", count: 1 },
  //       { date: "2025-06-14", count: 1 },
  //       { date: "2025-06-15", count: 1 },
  //       { date: "2025-06-16", count: 1 },
  //       { date: "2025-06-17", count: 1 },
  //       { date: "2025-06-18", count: 1 },
  //       { date: "2025-06-19", count: 1 },
  //     ],
  //     completion_rate: 0.83,
  //   },
  //   {
  //     habit_id: 2,
  //     habit_name: "Exercise",
  //     current_streak: 1,
  //     longest_streak: 4,
  //     started_date: "2025-06-03",
  //     total_count: 5,
  //     logs: [
  //       { date: "2025-06-03", count: 1 },
  //       { date: "2025-06-04", count: 1 },
  //       { date: "2025-06-06", count: 1 },
  //     ],
  //     completion_rate: 0.56,
  //   },
  // ];
  // useEffect(() => {
  //   setSummary(mockSummary);
  // }, []);

  return (
    <div className="p-4">
      {/* <h1 className="text-2xl font-bold mb-6">Habit Streaks</h1> */}
      <GoBackButton />
      <div className="space-y-8">
        {summary.map((habit) => (
          <div key={habit.habit_id}>
            <HabitStatsCard key={habit.habit_id} habit={habit} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StreakPage;
