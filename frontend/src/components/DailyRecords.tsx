import { useEffect, useState } from "react";
import { fetchRecords } from "../features/record/daily";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Navigate } from "react-router-dom";
import { fetchStatus } from "../features/record/status";
import { formatTime } from "../App";

function DailyRecords() {
  const fetchedRecs = useAppSelector((state) => state.dailyRecords);
  const currentStatus = useAppSelector((state) => state.recordStatus);

  const dispatch = useAppDispatch();

  const login = localStorage.getItem("login") || "";

  useEffect(() => {
    dispatch(fetchRecords());
    dispatch(fetchStatus(login));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [filter, setFilter] = useState<string>("");

  const filteredRecords = fetchedRecs.records.filter((record) =>
    record.name.toLowerCase().includes(filter.toLowerCase())
  );

  if (currentStatus.status.options === "login") {
    return <Navigate replace to="/login" />;
  } else {
    return (
      <div className="main-content">
        <input
          className="custom-filter"
          type="text"
          placeholder="Filter by name"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        {fetchedRecs.loading && <div>Loading...</div>}
        {!fetchedRecs.loading && fetchedRecs.error ? (
          <div>Error: {fetchedRecs.error}</div>
        ) : null}
        {!fetchedRecs.loading && filteredRecords.length ? (
          <div className="styled-table-container">
            <table className="styled-table">
              <tbody>
                <tr>
                  <th>Name</th>
                  <th>Started At</th>
                  <th>Hours on Break</th>
                  <th>Hours Worked</th>
                  <th>Now at Work</th>
                  <th>Finished At</th>
                </tr>
                {filteredRecords.map((record, index) => (
                  <tr key={index}>
                    <td>{record.name}</td>
                    <td>{record.start}</td>
                    <td>{formatTime(record.brk_hrs)}</td>
                    <td>{formatTime(record.wrk_hrs)}</td>
                    <td>
                      {
                        <div
                          className={`table-circle
                           ${record.status ? "green-circle" : "red-circle"}
                            `}
                        ></div>
                      }
                    </td>
                    <td>{record.end}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    );
  }
}

export default DailyRecords;
