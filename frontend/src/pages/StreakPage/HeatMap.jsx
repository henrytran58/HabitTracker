import React from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import "./heatmapStyles.css"; // optional, for custom colors

const Heatmap = ({ data }) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 180); // Last 6 months

  const values = data.map((d) => ({
    date: d.date,
    count: d.count,
  }));

  return (
    <CalendarHeatmap
      startDate={startDate}
      endDate={endDate}
      values={values}
      classForValue={(value) => {
        if (!value) return "color-empty";
        if (value.count >= 5) return "color-github-4";
        if (value.count >= 3) return "color-github-3";
        if (value.count >= 2) return "color-github-2";
        return "color-github-1";
      }}
      showWeekdayLabels
      tooltipDataAttrs={(value) =>
        value.date ? { "data-tip": `${value.count} habits on ${value.date}` } : {}
      }
    />
  );
};

export default Heatmap;