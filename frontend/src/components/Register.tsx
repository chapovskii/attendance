import axios from "axios";
import React, { useEffect, useState } from "react";
import { Profile } from "../features/profile/login";
import { fetchStatus } from "../features/record/status";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Navigate } from "react-router-dom";

function RegistrationForm() {
  const [userData, setUserData] = useState<Profile>({
    email: "",
    login: "",
    name: "",
    phone: "",
    position: "",
  });

  const currentStatus = useAppSelector((state) => state.recordStatus);

  const dispatch = useAppDispatch();

  const login = localStorage.getItem("login") || "";

  useEffect(() => {
    dispatch(fetchStatus(login));
  }, [dispatch, login]);

  const successModal = (login: string) => {};
  const issueModal = (message: string) => {};

  const sendRequest = async (data: Profile) => {
    const response = await axios.post(
      `http://localhost:8000/graphql`,
      {
        query: `
        mutation CreateProfile($login: String!, $name: String!, $position: String!, $email: String!, $phone: String!) {
          createProfile(login: $login, name: $name, position: $position, email: $email, phone: $phone) {
            login
            name
            position
            email
            phone
          }
        }
            `,
        variables: data,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    response.data.data
      ? successModal(response.data.data.createProfile.login)
      : issueModal(
          response.data.errors[0]
            ? response.data.errors[0].message
            : "network error"
        );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({ ...prevUserData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendRequest(userData);
  };

  if (currentStatus.status.options === "login") {
    return <Navigate replace to="/login" />;
  } else {
    return (
      <div className="main-content">
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Login:</label>
            <input
              type="text"
              name="login"
              value={userData.login}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Full Name:</label>
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Phone:</label>
            <input
              type="tel"
              name="phone"
              value={userData.phone}
              onChange={handleChange}
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{3}"
              placeholder="Format: 123-456-789"
              required
            />
          </div>
          <div>
            <label>Position:</label>
            <input
              type="text"
              name="position"
              value={userData.position}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <button type="submit">Register</button>
          </div>
        </form>
      </div>
    );
  }
}

export default RegistrationForm;
