import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Navigate } from "react-router-dom";
import { fetchStatus } from "../features/record/status";
import { extendedRecord, fetchIssues } from "../features/record/issues";
import EditableRow from "./EditableRow";
import { Record } from "../features/record/daily";

function Issues() {
  const currentStatus = useAppSelector((state) => state.recordStatus);
  const issuesFounds = useAppSelector((state) => state.foundIssues);

  // const [selectedTable, setSelectedTable] = useState<"issues" | "suspicious">(
  //   "issues"
  // );

  const dispatch = useAppDispatch();

  const login = localStorage.getItem("login") || "";

  useEffect(() => {
    dispatch(fetchStatus(login));
    dispatch(fetchIssues());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!currentStatus.status.adminRole) {
    return <Navigate replace to="/login" />;
  } else {
    return (
      <div className="main-content">
        {/* <div>
          <button onClick={() => setSelectedTable("issues")}>
            Found Issues
          </button>
          <button onClick={() => setSelectedTable("suspicious")}>
            Suspicious Records
          </button>
        </div> */}
        {/* {selectedTable === "issues" &&  ( */}
        <div className="styled-table-container">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Login</th>
                <th>Name</th>
                <th>Date</th>
                <th>Started at</th>
                <th>Hours Worked</th>
              </tr>
            </thead>

            <tbody>
              {issuesFounds.issues.fix_required.map(
                (record: extendedRecord, index) => (
                  <EditableRow
                    key={index}
                    record={record}
                    onEdit={() => {
                      dispatch(fetchIssues());
                    }}
                  />
                )
              )}
            </tbody>
          </table>
        </div>
        {/* )} */}
        {/* {selectedTable === "suspicious" && (
          <table className="styled-table">
            <thead>
              <tr>
                <th>Login</th>
                <th>Date</th>
                <th>Started at</th>
                <th>Hours Worked</th>
              </tr>
            </thead>
            <tbody>
              {issuesFounds.issues.fix_required.map(
                (record: extendedRecord) => (
                  <EditableRow key={record.login} record={record} />
                )
              )}
            </tbody>
          </table>
        )} */}
      </div>
    );
  }
}

export default Issues;
