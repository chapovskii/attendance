import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchRecordsMonthly } from "../features/record/monthly";
import { fetchStatus } from "../features/record/status";
import { Navigate } from "react-router-dom";
import { formatTime } from "../App";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const years = Array.from(
  { length: 5 },
  (_, index) => new Date().getFullYear() - 4 + index
);

function MonthlyRecords() {
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth()
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  const currentStatus = useAppSelector((state) => state.recordStatus);

  const handleDownloadExcel = () => {};

  const fetchedRecs = useAppSelector((state) => state.monthlyRecords);
  const dispatch = useAppDispatch();
  const login = localStorage.getItem("login") || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statusPromise = dispatch(fetchStatus(login));
        const recordsPromise = await dispatch(
          fetchRecordsMonthly(
            new Date(selectedYear, selectedMonth).toISOString()
          )
        );

        await Promise.all([statusPromise, recordsPromise]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [dispatch, login, selectedMonth, selectedYear]);

  if (!currentStatus.loading && currentStatus.status.options === "login") {
    return <Navigate replace to="/login" />;
  } else {
    return (
      <div className="main-content">
        <h1>Monthly Records</h1>

        <div className="month-year-picker">
          show data from month:
          <div className="select-container">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="custom-select"
            >
              {months.map((mt, idx) => (
                <option value={idx}>{mt}</option>
              ))}
            </select>
          </div>
          <div className="select-container">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="custom-select"
            >
              {years.map((year, index) => (
                <option key={index} value={year}>
                  {year}
                </option>
              ))}
              {/* todo: get years from records aggregation */}
            </select>
          </div>
        </div>
        {fetchedRecs.loading && <div>Loading...</div>}
        {!fetchedRecs.loading && fetchedRecs.error ? (
          <div>Error: {fetchedRecs.error}</div>
        ) : null}
        {!fetchedRecs.loading && fetchedRecs.records.length ? (
          <>
            <table className="styled-table">
              <tbody>
                <tr>
                  <th key={"_id"}>{"login"}</th>
                  <th key={"brk_hrs"}>{"hours on break"}</th>
                  <th key={"wrk_hrs"}>{"hours worked"}</th>
                </tr>
                {fetchedRecs.records.map((record, index) => (
                  <tr key={index}>
                    <td>{record.login}</td>
                    <td>{formatTime(record.brk_hrs)}</td>
                    <td>{formatTime(record.wrk_hrs)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : null}

        <button onClick={handleDownloadExcel} className="download-button">
          Download as Excel Document
        </button>
      </div>
    );
  }
}

export default MonthlyRecords;
