import React from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import "./heatmapStyles.css";

function computeStreaks(logs) {
  const sortedLogs = logs
    .map((log) => ({
      ...log,
      dateObj: new Date(log.date),
    }))
    .sort((a, b) => a.dateObj - b.dateObj);

  let streak = 0;
  let prevDate = null;

  const streakLogs = [];

  for (let i = 0; i < sortedLogs.length; i++) {
    const { date, dateObj } = sortedLogs[i];

    if (prevDate) {
      const diffInDays = Math.round(
        (dateObj - prevDate) / (1000 * 60 * 60 * 24)
      );

      if (diffInDays === 1) {
        streak++;
      } else {
        streak = 1;
      }
    } else {
      streak = 1;
    }

    streakLogs.push({ date, streak });
    prevDate = dateObj;
  }

  return streakLogs;
}
const Heatmap = ({ data }) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 360);

  // const values = data.map((d) => ({
  //   date: d.date,
  //   count: d.count,
  // }));
  // console.log(values)
  const streakData = computeStreaks(data); 
  console.log(streakData);

  

  return (
    <>
      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        values={streakData}
        classForValue={(value) => {
          if (!value || !value.streak) return "color-empty";
          const capped = Math.min(value.streak, 15);
          return `color-streak-${capped}`;
        }}
        showWeekdayLabels
        tooltipDataAttrs={(value) =>
          value.date ? { "data-tip": `${value.count} habits on ${value.date}` } : {}
        }
      />
    </>
  );
};

export default Heatmap;