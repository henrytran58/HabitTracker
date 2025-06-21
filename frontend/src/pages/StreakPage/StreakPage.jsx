import React, { useEffect, useState } from "react";
import Heatmap from "./HeatMap";

const HabitStatsCard = ({ habit }) => {
    console.log(habit)
    return (
      <div className="p-4 border rounded-md shadow bg-white space-y-2">
        <h2 className="text-lg font-semibold">{habit.habit_name}</h2>
        <Heatmap data={habit.logs} />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-center">
          <div>
            <p className="text-2xl font-bold text-green-600">{habit.current_streak}</p>
            <p className="text-sm text-gray-600">Current Streak</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{habit.longest_streak}</p>
            <p className="text-sm text-gray-600">Longest Streak</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{habit.total_count}</p>
            <p className="text-sm text-gray-600">Total Count</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {Math.round(habit.completion_rate * 100)}%
            </p>
            <p className="text-sm text-gray-600">Completion Rate</p>
          </div>
        </div>
      </div>
    );
  };

const StreakPage = () => {
  const [summary, setSummary] = useState([]);

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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Habit Heatmaps</h1>
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
