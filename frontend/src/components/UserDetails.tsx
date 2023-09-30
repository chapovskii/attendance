import React, { useState } from "react";

interface UserDetailsProps {
  user: {
    login: string;
    startedAt: string;
    hoursOnBreak: string;
    hoursWorked: string;
    nowAtWork: string;
    finishedAt: string;
  } | null;
}
const user = {
  login: "User1",
  startedAt: "09:00 AM",
  hoursOnBreak: "1.5",
  hoursWorked: "6.5",
  nowAtWork: "Yes",
  finishedAt: "05:30 PM",
};

function UserDetails() {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUser(e.target.value);
  };
  return (
    <div className="user-details">
      <h2>User Details</h2>

      {user && (
        <div className="user-info">
          <h3>{user.login}</h3>
          <p>Started At: {user.startedAt}</p>
          <p>Hours on Break: {user.hoursOnBreak}</p>
          <p>Hours Worked: {user.hoursWorked}</p>
          <p>Now at Work: {user.nowAtWork}</p>
          <p>Finished At: {user.finishedAt}</p>
        </div>
      )}
    </div>
  );
}

export default UserDetails;
