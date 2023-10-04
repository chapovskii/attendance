import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchRecordsMonthly } from "../features/record/monthly";

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

function MonthlyRecords() {
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth()
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  const handleDownloadExcel = () => {};

  const fetchedRecs = useAppSelector((state) => state.monthlyRecords);
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log(new Date(selectedYear, selectedMonth).toISOString());
    dispatch(
      fetchRecordsMonthly(new Date(selectedYear, selectedMonth).toISOString())
    );
  }, [dispatch, selectedMonth, selectedYear]);

  return (
    <div className="main-content">
      {fetchedRecs.loading && <div>Loading...</div>}
      {!fetchedRecs.loading && fetchedRecs.error ? (
        <div>Error: {fetchedRecs.error}</div>
      ) : null}
      {!fetchedRecs.loading && fetchedRecs.records.length ? (
        <>
          <table className="record-table">
            <tbody>
              <tr>
                <th key={"_id"}>{"login"}</th>
                <th key={"brk_hrs"}>{"hours on break"}</th>
                <th key={"wrk_hrs"}>{"hours worked"}</th>
              </tr>
              {fetchedRecs.records.map((record, index) => (
                <tr key={index}>
                  <td>{record.login}</td>
                  <td>{record.brk_hrs}</td>
                  <td>{record.wrk_hrs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : null}

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
