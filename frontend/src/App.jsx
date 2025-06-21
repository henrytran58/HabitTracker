import "./App.css";
import HabitPage from "./pages/HabitPage/HabitPage";
import LoginPage from "./pages/Dashboard/LoginPage";
import { useEffect } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/habits");
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/habits" element={<HabitPage />} />
    </Routes>
  );
}

export default App;