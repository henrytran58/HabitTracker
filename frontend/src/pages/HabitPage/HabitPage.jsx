import React, { useEffect, useState } from "react";
import ListHabit from "./components/ListHabit";
import ToggleFormHabit from "./components/ToggleFormHabit";
import WeekDatePicker from "./components/WeekDatePicker";
const HabitPage = () => {
  const [habits, setHabits] = useState([]);
  useEffect(() => {
    fetchHabits();
  }, []);

  const [habitLogs, setHabitLogs] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleHabitCreated = (newHabit) => {
    setHabits((prev) => [...prev, newHabit]);
  };
  const fetchHabits = async () => {
    const user_id = localStorage.getItem("userID");
  
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/habits?user_id=${user_id}`);
      const data = await response.json();
  
      if (response.ok) {
        setHabits(data.habits);
        console.log("User's habits:", data.habits);
      } else {
        console.error("Error fetching habits:", data.error);
      }
    } catch (err) {
      console.error("Fetch error:", err.message);
    }
  };

  useEffect(() => {
    fetchHabitLogsForDate(selectedDate);
  }, [selectedDate]);

  const fetchHabitLogsForDate = async (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    const response = await fetch(
      `http://127.0.0.1:5000/api/habit_logs?date=${formattedDate}`
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

    const response = await fetch("http://127.0.0.1:5000/api/create_habit_log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        habit_id: habitId,
        completed: formattedDate,
        status: isDone,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setHabitLogs((prev) => ({
        ...prev,
        [habitId]: data.habit_log,
      }));
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
      `http://127.0.0.1:5000/api/delete_habit/${habitId}`,
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
    // For demo: just increment the count (you can show a real form/modal later)
    const response = await fetch(
      `http://127.0.0.1:5000/api/update_habit/${habitId}`,
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

  const onDateChange = (date) => {
    // console.log(date);
    setSelectedDate(new Date(date));
    // fetchHabitLogsForDate(selectedDate);
  };

  //test changed git acc

  return (
    <>
      <WeekDatePicker onDateChange={onDateChange} />
      <ListHabit
        habits={habits}
        habitLogs={habitLogs}
        onToggleHabit={handleToggleHabit}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />
      ;
      <ToggleFormHabit onHabitCreated={handleHabitCreated} />
    </>
  );
};

export default HabitPage;
