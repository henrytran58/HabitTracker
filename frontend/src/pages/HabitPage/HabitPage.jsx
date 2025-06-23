import React, { useEffect, useState } from "react";
import ListHabit from "./components/ListHabit";
import { useNavigate } from "react-router-dom";
import ToggleFormHabit from "./components/ToggleFormHabit";
import WeekDatePicker from "./components/WeekDatePicker";
const HabitPage = () => {
  const [habits, setHabits] = useState([]);
  const navigate = useNavigate();
  //styling
  // const mockHabits = [
  //   {
  //     id: 1,
  //     user_id: 101,
  //     name: "Drink Water",
  //     frequency: "daily",
  //     start_date: "2024-12-01",
  //     current_streak: 7,
  //     longest_streak: 10,
  //     count: 45
  //   },
  //   {
  //     id: 2,
  //     user_id: 101,
  //     name: "Exercise (30 mins)",
  //     frequency: "daily",
  //     start_date: "2025-01-15",
  //     current_streak: 3,
  //     longest_streak: 8,
  //     count: 21
  //   },
  //   {
  //     id: 3,
  //     user_id: 101,
  //     name: "Read a Book",
  //     frequency: "daily",
  //     start_date: "2025-03-10",
  //     current_streak: 0,
  //     longest_streak: 4,
  //     count: 16
  //   },
  //   {
  //     id: 4,
  //     user_id: 101,
  //     name: "Meditation",
  //     frequency: "daily",
  //     start_date: "2025-04-01",
  //     current_streak: 12,
  //     longest_streak: 12,
  //     count: 33
  //   },
  //   {
  //     id: 5,
  //     user_id: 101,
  //     name: "Coding Practice",
  //     frequency: "daily",
  //     start_date: "2025-02-20",
  //     current_streak: 1,
  //     longest_streak: 5,
  //     count: 18
  //   },
  //   {
  //     id: 6,
  //     user_id: 101,
  //     name: "Walk the Dog",
  //     frequency: "daily",
  //     start_date: "2025-06-01",
  //     current_streak: 9,
  //     longest_streak: 15,
  //     count: 60
  //   },
  //   {
  //     id: 7,
  //     user_id: 101,
  //     name: "Journal",
  //     frequency: "daily",
  //     start_date: "2025-06-10",
  //     current_streak: 2,
  //     longest_streak: 6,
  //     count: 9
  //   },
  // ];
  useEffect(() => {
    fetchHabits();
    // setHabits(mockHabits);
  }, []);

  const [habitLogs, setHabitLogs] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleHabitCreated = (newHabit) => {
    setHabits((prev) => [...prev, newHabit]);
  };

  const fetchHabits = async () => {
    const userId = localStorage.getItem("userID");

    if (!userId) {
      console.error("Missing user ID");
      return;
    }
  
    try {
      const response = await fetch(
        `https://habittracker-8.onrender.com/api/habits?user_id=${userId}`
      );
      const data = await response.json();
  
      if (response.ok) {
        setHabits(data.habits);
      } else {
        console.error("Error fetching habits:", data.error);
      }
    } catch (err) {
      console.error("Fetch error:", err.message);
    }
  };
  // const fetchHabits = async () => {
  //   const token = localStorage.getItem("token");
  //   console.log("Token:", token); //
  //   try {
  //     const response = await fetch(
  //       `https://habittracker-8.onrender.com/api/habits`,
  //       {
  //         headers: {
  //           "Authorization": `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     const data = await response.json();

  //     if (response.ok) {
  //       setHabits(data.habits);
  //       // console.log("User's habits:", data.habits);
  //     } else {
  //       console.error("Error fetching habits:", data.error);
  //     }
  //   } catch (err) {
  //     console.error("Fetch error:", err.message);
  //   }
  // };
  //styling
  useEffect(() => {
    fetchHabitLogsForDate(selectedDate);
  }, [selectedDate]);

  const fetchHabitLogsForDate = async (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    const response = await fetch(
      `https://habittracker-8.onrender.com/api/habit_logs?date=${formattedDate}`
    );
    const data = await response.json();

    // Map by habit_id for quick lookup
    const logsByHabit = {};
    data.habit_logs.forEach((log) => {
      logsByHabit[log.habit_id] = log;
    });

    setHabitLogs(logsByHabit);
  };

  const handleToggleHabit = async (habitId, isDone) => {
    const formattedDate = selectedDate.toISOString().split("T")[0];
    console.log(formattedDate);
    //backend
    const response = await fetch(
      "https://habittracker-8.onrender.com/api/create_habit_log",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          habit_id: habitId,
          completed: formattedDate,
          status: isDone,
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      setHabitLogs((prev) => ({
        ...prev,
        [habitId]: data.habit_log,
      }));
      //styling
      fetchHabits();
    } else {
      const err = await response.json();
      alert(err.message || "Failed to update habit log.");
    }
  };

  const handleDelete = async (habitId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this habit?"
    );
    if (!confirmed) return;

    const response = await fetch(
      `https://habittracker-8.onrender.com/api/delete_habit/${habitId}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      setHabits((prev) => prev.filter((habit) => habit.id !== habitId));
    } else {
      const err = await response.json();
      alert(err.message || "Failed to delete habit.");
    }
  };

  const handleUpdate = async (habitId, newName) => {
    const response = await fetch(
      `https://habittracker-8.onrender.com/api/update_habit/${habitId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      }
    );

    if (response.ok) {
      const updatedHabit = await response.json();
      setHabits((prev) =>
        prev.map((habit) => (habit.id === habitId ? updatedHabit.habit : habit))
      );
    } else {
      const err = await response.json();
      alert(err.message || "Failed to update habit.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userID");
    navigate("/");
  };

  const onDateChange = (date) => {
    // console.log(date);
    setSelectedDate(new Date(date));
    // fetchHabitLogsForDate(selectedDate);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300  to-purple-200 p-6 relative text-gray-900">
      {/* Logout button top-right */}
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 cursor-pointer"
        style={{ padding: "6px 12px" }}
      >
        Log out
      </button>

      {/* Date Picker */}
      <WeekDatePicker onDateChange={onDateChange} />

      {/* Habit List */}
      <ListHabit
        habits={habits}
        habitLogs={habitLogs}
        onToggleHabit={handleToggleHabit}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
        className="mt-6"
      />

      {/* Buttons below habit list */}
      <div className="flex justify-between mt-6">
        {/* Add Habit (ToggleFormHabit) on left */}
        <div>
          <ToggleFormHabit onHabitCreated={handleHabitCreated} />
        </div>

        {/* View Streak button on right */}
        <button
          onClick={() => navigate("/streaks")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          View Habit Streaks
        </button>
      </div>
    </div>
  );

  // return (
  //   <div className="">
  //     <WeekDatePicker onDateChange={onDateChange} />
  //     <ListHabit
  //       habits={habits}
  //       habitLogs={habitLogs}
  //       onToggleHabit={handleToggleHabit}
  //       onDelete={handleDelete}
  //       onUpdate={handleUpdate}
  //     />
  //     ;
  //     <ToggleFormHabit onHabitCreated={handleHabitCreated} />
  //     <button
  //       onClick={handleLogout}
  //       style={{ padding: "8px 16px", cursor: "pointer" }}
  //     >
  //       Logout
  //     </button>
  //     <button
  //       onClick={() => navigate("/streaks")}
  //       className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
  //     >
  //       View Streak Heatmap
  //     </button>
  //   </div>
  // );
};

export default HabitPage;
