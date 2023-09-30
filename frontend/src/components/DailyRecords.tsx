import React from "react";
import UserDetails from "./UserDetails";

const tableData = [
  {
    login: "User1",
    startedAt: "09:00 AM",
    hoursOnBreak: "1.5",
    hoursWorked: "6.5",
    nowAtWork: "Yes",
    finishedAt: "05:30 PM",
  },
];

function DailyRecords() {
  return (
    <div className="main-content">
      <h1>Daily Records</h1>
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
      <UserDetails />

      <button
        // onClick={handleDownloadExcel}
        className="download-button"
      >
        SET RECORD
      </button>
    </div>
  );
}

export default DailyRecords;
