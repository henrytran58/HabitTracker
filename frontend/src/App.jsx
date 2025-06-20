import "./App.css";
import HabitPage from "./pages/HabitPage/HabitPage";
import LoginPage from "./pages/Dashboard/LoginPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return    <BrowserRouter>
  <Routes>
    <Route path="/" element={<LoginPage />} />
    <Route path="/habits" element={<HabitPage />} />
  </Routes>
</BrowserRouter>
}

export default App;
