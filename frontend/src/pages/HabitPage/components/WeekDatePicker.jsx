import React, { useState } from "react";

const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function getWeekDates(startDate = new Date()) {
  const sunday = new Date(startDate);
  sunday.setDate(sunday.getDate() - sunday.getDay());

  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    return d;
  });
}

const WeekDatePicker = ({ onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentSunday, setCurrentSunday] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay());
    return d;
  });

  const weekDates = getWeekDates(currentSunday);
  const today = new Date();

  const handleDateClick = (date) => {
    if (date > today) return; // Prevent selecting future dates
    setSelectedDate(date);
    if (onDateChange) onDateChange(new Date(date));
  };

  const handlePrevWeek = () => {
    const newSunday = new Date(currentSunday);
    newSunday.setDate(currentSunday.getDate() - 7);
    setSelectedDate(newSunday);
    if (onDateChange) onDateChange(new Date(newSunday));
    setCurrentSunday(newSunday);

    // console.log(newSunday);
  };

  const handleNextWeek = () => {
    const newSunday = new Date(currentSunday);
    newSunday.setDate(currentSunday.getDate() + 7);

    // Only allow if the whole week is not in the future
    if (newSunday <= today) {
      setCurrentSunday(newSunday);
      setSelectedDate(newSunday);
      if (onDateChange) onDateChange(new Date(newSunday));
    }

    // console.log(newSunday);
  };

  const selectedMonthYear = selectedDate.toLocaleDateString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex flex-col items-center space-y-2 mb-4">
      {/* Month & Year Header */}
      <div className="flex items-center space-x-4 text-lg font-semibold">
        <button
          onClick={handlePrevWeek}
          className="text-gray-600 hover:text-black px-2 py-1 rounded hover:bg-gray-200"
        >
          ←
        </button>
        <span>{selectedMonthYear}</span>
        <button
          onClick={handleNextWeek}
          className={`px-2 py-1 rounded ${
            currentSunday.getTime() + 7 * 24 * 60 * 60 * 1000 > today.getTime()
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:text-black hover:bg-gray-200"
          }`}
          disabled={
            currentSunday.getTime() + 7 * 24 * 60 * 60 * 1000 > today.getTime()
          }
        >
          →
        </button>
      </div>

      {/* Weekday Buttons */}
      <div className="flex space-x-3 bg-gray-100 p-4 rounded-md justify-center max-w-md">
        {weekDates.map((date) => {
          const dayName = daysOfWeek[date.getDay()];
          const dayNumber = date.getDate();
          const isSelected =
            date.toDateString() === selectedDate.toDateString();
          const isFuture = date > today;

          return (
            <button
              key={date.toISOString()}
              onClick={() => handleDateClick(date)}
              disabled={isFuture}
              className={`
                flex flex-col items-center px-3 py-2 rounded-md cursor-pointer
                ${
                  isSelected
                    ? "bg-gray-300 text-black font-semibold"
                    : "text-gray-600"
                }
                ${
                  isFuture
                    ? "opacity-30 cursor-not-allowed"
                    : "hover:bg-gray-200"
                }
              `}
            >
              <span className="text-xs">{dayName}</span>
              <span className="text-sm">{dayNumber}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default WeekDatePicker;
