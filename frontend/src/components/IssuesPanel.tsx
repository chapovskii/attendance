import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Navigate } from "react-router-dom";
import { fetchStatus } from "../features/record/status";
import { Record } from "../features/record/daily";
import { fetchIssues } from "../features/record/issues";

function IssuesPanel() {
  const issuesFounds = useAppSelector((state) => state.foundIssues);
  const currentStatus = useAppSelector((state) => state.recordStatus);

  const dispatch = useAppDispatch();
  const login = localStorage.getItem("login") || "";

  useEffect(() => {
    dispatch(fetchStatus(login));
    dispatch(fetchIssues());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [selectedTable, setSelectedTable] = useState("foundIssues");
  const [editedWorkHours, setEditedWorkHours] = useState<Record[]>([]);
  const [changesMade, setChangesMade] = useState(false);

  const handleTableToggle = (tableName: string) => {
    setSelectedTable(tableName);
  };

  const handleEditWorkHours = (login: string, newValue: number) => {
    const updatedWorkHours = editedWorkHours.map((record) =>
      record.login === login ? { ...record, wrk_hrs: newValue } : record
    );
    setEditedWorkHours(updatedWorkHours);
    setChangesMade(true);
  };

  const handleSubmit = () => {
    // updateWorkHours(editedWorkHours);
    setChangesMade(false);
  };

  if (currentStatus.status.options === "login") {
    return <Navigate replace to="/login" />;
  } else {
    return (
      <div className="main-content">
        <button onClick={() => handleTableToggle("foundIssues")}>
          Found Issues
        </button>
        <button onClick={() => handleTableToggle("suspiciousRecords")}>
          Suspicious Records
        </button>

        {selectedTable === "foundIssues" && (
          <>
            <table>
              <thead>
                <tr>
                  <th>Login</th>
                  <th>Work Hours</th>
                  <th>Start Time</th>
                </tr>
              </thead>
              <tbody>
                {issuesFounds.issues.fix_required.map((record: Record) => (
                  <tr key={record.login}>
                    <td>{record.login}</td>
                    <td>
                      <input
                        type="number"
                        value={
                          editedWorkHours.find((r) => r.login === record.login)
                            ?.wrk_hrs || record.wrk_hrs
                        }
                        onChange={(e) =>
                          handleEditWorkHours(record.login, +e.target.value)
                        }
                      />
                    </td>
                    <td>{record.start}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {changesMade && <button onClick={handleSubmit}>Submit</button>}
          </>
        )}

        {selectedTable === "suspiciousRecords" && (
          <table>
            <thead>
              <tr>
                <th>Login</th>
                <th>Status</th>
                <th>Work Hours</th>
                <th>Break Hours</th>
                <th>Coffee Break</th>
                <th>End Time</th>
                <th>Start Time</th>
              </tr>
            </thead>
            <tbody>
              {issuesFounds.issues.suspicious.map((record: Record) => (
                <tr key={record.login}>
                  <td>{record.login}</td>
                  <td>{record.status ? "Active" : "Inactive"}</td>
                  <td>{record.wrk_hrs}</td>
                  <td>{record.brk_hrs}</td>
                  <td>{record.cfbreak}</td>
                  <td>{record.end}</td>
                  <td>{record.start}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }
}

export default IssuesPanel;
