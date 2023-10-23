import React, { useEffect, useState } from "react";
import { fetchRecords } from "../features/record/daily";
import UserDetails from "./UserDetails";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Navigate } from "react-router-dom";
import { fetchStatus } from "../features/record/status";

function DailyRecords() {
  const fetchedRecs = useAppSelector((state) => state.dailyRecords);
  const currentStatus = useAppSelector((state) => state.recordStatus);

  const dispatch = useAppDispatch();

  const login = localStorage.getItem("login") || "";

  useEffect(() => {
    dispatch(fetchRecords());
    dispatch(fetchStatus(login));
  }, []);

  if (currentStatus.status.options === "login") {
    return <Navigate replace to="/login" />;
  } else {
    return (
      <div className="main-content">
        <h1>Daily Records</h1>

        {fetchedRecs.loading && <div>Loading...</div>}
        {!fetchedRecs.loading && fetchedRecs.error ? (
          <div>Error: {fetchedRecs.error}</div>
        ) : null}
        {!fetchedRecs.loading && fetchedRecs.records.length ? (
          <>
            <table className="record-table">
              <tbody>
                <tr>
                  <th>Login</th>
                  <th>Started At</th>
                  <th>Hours on Break</th>
                  <th>Hours Worked</th>
                  <th>Now at Work</th>
                  <th>Finished At</th>
                </tr>
                {fetchedRecs.records.map((record, index) => (
                  <tr key={index}>
                    <td>{record.login}</td>
                    <td>{record.start}</td>
                    <td>{record.cfbreak}</td>
                    <td>{record.wrk_hrs}</td>
                    <td>{record.status ? "Yes" : "No"}</td>
                    <td>{record.end}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <UserDetails />
          </>
        ) : null}
      </div>
    );
  }
}

export default DailyRecords;
