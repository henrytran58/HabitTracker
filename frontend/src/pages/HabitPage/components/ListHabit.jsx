import React, { useEffect, useRef, useState } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

const ListHabit = ({
  habits,
  habitLogs,
  onToggleHabit,
  onDelete,
  onUpdate,
}) => {
  const [editingHabitId, setEditingHabitId] = useState(null);
  const [editName, setEditName] = useState("");
  const inputRef = useRef(null);

  const handleStartEdit = (habit) => {
    setEditingHabitId(habit.id);
    setEditName(habit.name);
  };

  const handleCancel = () => {
    setEditingHabitId(null);
    setEditName("");
  };

  const handleSave = () => {
    onUpdate(editingHabitId, editName);
    setEditingHabitId(null);
    setEditName("");
  };

  // Focus input when editingHabitId changes and form is shown
  useEffect(() => {
    if (editingHabitId !== null && inputRef.current) {
      inputRef.current.focus();
      // Optional: Move cursor to the end
      const length = inputRef.current.value.length;
      inputRef.current.setSelectionRange(length, length);
    }
  }, [editingHabitId]);
  return (
    <div>
      <table className="min-w-full border border-gray-300 rounded-lg shadow-md">
        <thead>
          <tr>
            <th>Done</th>
            <th className="text-left pl-4">Habit Name</th>
            <th>Current Streak</th>
            <th>Longest Streak</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {habits.map((habit) => (
            <React.Fragment key={habit.id}>
              <tr className="hover:bg-gray-50 transition">
                <td className="px-4 py-2 border-b text-center">
                  <input
                    type="checkbox"
                    checked={habitLogs[habit.id]?.status ?? false}
                    onChange={(e) => onToggleHabit(habit.id, e.target.checked)}
                    className="w-5 h-5 cursor-pointer"
                  />
                </td>
                <td className="px-4 py-2 border-b">
                  {editingHabitId === habit.id ? (
                    <input
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault(); // prevent form submission if inside a form
                          handleSave();
                        }
                      }}
                      ref={inputRef}
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="px-2 py-1 border rounded w-full"
                    />
                  ) : (
                    <span
                      className={`font-semibold ${
                        habitLogs[habit.id]?.status
                          ? "text-gray-400 line-through"
                          : "text-gray-800"
                      }`}
                    >
                      {habit.name}
                    </span>
                  )}
                </td>
                <td className="px-4 py-2 border-b text-center">
                  {habit.current_streak}
                </td>
                <td className="px-4 py-2 border-b text-center">
                  {habit.longest_streak}
                </td>
                <td className="px-4 py-2 border-b text-center">
                  {habit.count}
                </td>
                <td className="px-4 py-2 border-b">
                  {editingHabitId === habit.id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-3 py-1 bg-gray-400 hover:bg-gray-500 text-white rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleStartEdit(habit)}
                        className="p-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded shadow-sm transition-colors duration-200"
                        aria-label="Edit habit"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => onDelete(habit.id)}
                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded shadow-sm transition-colors duration-200"
                        aria-label="Delete habit"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListHabit;
