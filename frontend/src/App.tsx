import DailyRecords from "./components/DailyRecords";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navigation from "./components/Navigation";
import "./App.css";
import MonthlyRecords from "./components/MonthlyRecords";
import RegistrationForm from "./components/Register";
import Authentification from "./components/Authentification";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { useEffect, useState } from "react";
import { fetchStatus } from "./features/record/status";
import SetButton from "./components/SetButton";

function App() {
  const barData = useAppSelector((state) => state.recordStatus);
  const storageLogin = localStorage.getItem("login");
  const [login, setLogin] = useState<string>(storageLogin || "");
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchStatus(login));
  }, [login]);

  const handleLoginChange = (newLogin: string) => {
    setLogin(newLogin);
  };

  const handleLogOut = () => {
    setLogin("");
  };

  const handleSetRecord = () => {
    dispatch(fetchStatus(login));
  };
  const setOptions: string = barData.status.options.toString();

  return (
    <div className="container">
      <Router>
        <Navigation />
        <Routes>
          {
            <Route
              path="/login"
              element={<Authentification loginCheck={handleLoginChange} />}
            />
          }
          <Route path="/monthly-records" element={<MonthlyRecords />} />
          <Route path="/daily-records" element={<DailyRecords />} />
          <Route path="/registration" element={<RegistrationForm />} />
        </Routes>
      </Router>

      {barData.status.options && barData.status.options !== "login" ? (
        <div className="bottom-bar">
          <div className="bottom-bar-data">
            <p className="bottom-bar-row">Login: {login}</p>
            <p className="bottom-bar-row">
              Started at: {barData.status.recordData.start}
            </p>
            <p className="bottom-bar-row">
              Hours Worked Today: {barData.status.recordData.start}
            </p>
          </div>
          <div className="bottom-bar-buttons">
            <SetButton submit={handleSetRecord}>Set Record</SetButton>
            <button>Send a report</button>
            <button onClick={handleLogOut}>Log Out </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default App;
