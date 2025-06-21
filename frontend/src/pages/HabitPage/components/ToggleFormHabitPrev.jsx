import { useState } from "react";

const ToggleFormHabitPrev = ({ onHabitCreated }) => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const user_id = Number(localStorage.getItem("userID"));
  console.log(user_id);

  const toggleForm = () => setShowForm(!showForm);

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = { user_id, name };

    const response = await fetch("http://127.0.0.1:5000/api/create_habit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const message = await response.json();
      alert(message.message || "Failed to create habit.");
    } else {
      const result = await response.json();
      setName("");
      if (onHabitCreated) {
        onHabitCreated(result.habit); // ✅ Trigger update
      }
      //   alert("Habit created successfully!");
      setShowForm(false); // Optionally hide form after submit
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6">
      <button
        onClick={toggleForm}
        className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded shadow transition"
      >
        <span className="text-xl font-bold">+</span>
        <span>{showForm ? "Cancel" : "Add Habit"}</span>
      </button>

      {showForm && (
        <form
          onSubmit={onSubmit}
          className="mt-4 bg-white p-6 rounded shadow space-y-4"
        >
          <h2 className="text-lg font-semibold text-gray-800">
            Create a New Habit
          </h2>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Habit Name:
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="e.g. Drink water"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
          >
            Create Habit
          </button>
        </form>
      )}
    </div>
  );
};

export default ToggleFormHabitPrev;
