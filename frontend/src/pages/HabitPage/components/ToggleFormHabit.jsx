import { useState, useRef, useEffect } from "react";

const ToggleFormHabit = ({ onHabitCreated }) => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const user_id = Number(localStorage.getItem("userID"));
  const inputRef = useRef(null);

  const toggleForm = () => setShowForm(!showForm);

  // Auto-focus input when modal opens
  useEffect(() => {
    if (showForm && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showForm]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = { user_id, name };

    const response = await fetch("https://habittracker-8.onrender.com/api/create_habit", {
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
        onHabitCreated(result.habit);
      }
      setShowForm(false);
    }
  };

  return (
    <>
      {/* Add Habit Button */}
      <button
        onClick={toggleForm}
        className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded shadow transition"
      >
        <span className="text-xl font-bold">+</span>
        <span>Add Habit</span>
      </button>

      {/* Modal Form without background overlay */}
      {showForm && (
        <form
          onSubmit={onSubmit}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow-lg max-w-md w-full z-50"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Create a New Habit
          </h2>
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
            ref={inputRef}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
            placeholder="e.g. Drink water"
            required
          />
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={toggleForm}
              className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
            >
              Create Habit
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default ToggleFormHabit;
