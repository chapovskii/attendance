import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchRecordsMonthly } from "../features/record/monthly";
import { fetchStatus } from "../features/record/status";
import { Navigate } from "react-router-dom";
import { formatTime } from "../App";
import { TableExport } from "tableexport";

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

  const handleDownloadExcel = () => {
    const tableElement = document.getElementById("toExcel");

    if (tableElement) {
      new TableExport(tableElement, {
        filename: "month_schelude",
        sheetname: "month_schelude",
      });
    }
  };

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

  const [filter, setFilter] = useState<string>("");

  const filteredRecords = fetchedRecs.records.filter((record) =>
    record.name.toLowerCase().includes(filter.toLowerCase())
  );

  if (!currentStatus.loading && currentStatus.status.options === "login") {
    return <Navigate replace to="/login" />;
  } else {
    return (
      <div className="main-content">
        <div className="table-filter">
          show month:
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
          >
            {months.map((mt, idx) => (
              <option key={mt} value={idx}>
                {mt}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {years.map((year, index) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
            {/* todo: get years from records aggregation */}
          </select>
        </div>
        {fetchedRecs.loading && <div>Loading...</div>}
        {!fetchedRecs.loading && fetchedRecs.error ? (
          <div>Error: {fetchedRecs.error}</div>
        ) : null}
        {!fetchedRecs.loading && filteredRecords.length ? (
          <>
            <input
              className="custom-filter"
              type="text"
              placeholder="Filter by name"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <div className="styled-table-container">
              <table className="styled-table" id="toExcel">
                <tbody>
                  <tr>
                    <th>Name</th>
                    <th>Hours on Break</th>
                    <th>Hours Worked</th>
                  </tr>
                  {filteredRecords.map((record, index) => (
                    <tr key={index}>
                      <td>{record.name}</td>
                      <td>{formatTime(record.brk_hrs)}</td>
                      <td>{formatTime(record.wrk_hrs)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : null}

        <button onClick={handleDownloadExcel} className="download-button">
          Download this table
        </button>
      </div>
    );
  }
}

export default MonthlyRecords;
