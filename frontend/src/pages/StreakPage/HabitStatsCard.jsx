import Heatmap from "./HeatMap";

const HabitStatsCard = ({ habit }) => {
    return (
      <div className="p-3 border rounded-md shadow bg-white space-y-1">
        <h2 className="text-3xl font-serif text-gray-700 drop-shadow-md">
          {habit.habit_name}
        </h2>
  
        <Heatmap data={habit.logs} />
  
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 text-center text-sm">
          <div>
            <p className="text-3xl font-bold text-green-600">
              {habit.current_streak}
            </p>
            <p className="text-xs text-gray-600">CURRENT STREAK</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-green-600">
              {habit.longest_streak}
            </p>
            <p className="text-xs text-gray-600">LONGEST STREAK</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-green-600">
              {habit.total_count}
            </p>
            <p className="text-xs text-gray-600">TOTAL</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-green-600">
              {Math.round(habit.completion_rate * 100)}%
            </p>
            <p className="text-xs text-gray-600">COMPLETE RATE</p>
          </div>
        </div>
      </div>
    );
  };

  export default HabitStatsCard;