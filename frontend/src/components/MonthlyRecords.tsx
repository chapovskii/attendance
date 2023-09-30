import React, { useState } from "react";

interface Record {
  login: string;
  startedAt: string;
  hoursOnBreak: string;
  hoursWorked: string;
  nowAtWork: string;
  finishedAt: string;
}

const tableData: Record[] = [
  {
    login: "User1",
    startedAt: "09:00 AM",
    hoursOnBreak: "1.5",
    hoursWorked: "6.5",
    nowAtWork: "Yes",
    finishedAt: "05:30 PM",
  },
];

function MonthlyRecords() {
  const [selectedMonth, setSelectedMonth] = useState<number>(1);
  const [selectedYear, setSelectedYear] = useState<number>(2023);

  const handleDownloadExcel = () => {};
  return (
    <div className="main-content">
      <h1>Monthly Records</h1>

      <table className="record-table">
        <thead>
          <tr>
            <th>Login</th>
            <th>Started At</th>
            <th>Hours on Break</th>
            <th>Hours Worked</th>
            <th>Now at Work</th>
            <th>Finished At</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((record, index) => (
            <tr key={index}>
              <td>{record.login}</td>
              <td>{record.startedAt}</td>
              <td>{record.hoursOnBreak}</td>
              <td>{record.hoursWorked}</td>
              <td>{record.nowAtWork}</td>
              <td>{record.finishedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="month-year-picker">
        <div className="select-container">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="custom-select"
          >
            {/* todo: choose month */}
          </select>
        </div>
        <div className="select-container">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="custom-select"
          >
            {/* todo: choose year */}
          </select>
        </div>
        <button onClick={handleDownloadExcel} className="download-button">
          Download as Excel Document
        </button>
      </div>
    </div>
  );
}

export default MonthlyRecords;
