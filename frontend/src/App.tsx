import DailyRecords from "./components/DailyRecords";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navigation from "./components/Navigation";
import "./App.css";
import MonthlyRecords from "./components/MonthlyRecords";

function App() {
  return (
    <div className="container">
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<div />} />
          <Route path="/monthly-records" element={<MonthlyRecords />} />
          <Route path="/daily-records" element={<DailyRecords />} />
        </Routes>
      </Router>
      <div>hhhhhhhh</div>
    </div>
  );
}

export default App;
