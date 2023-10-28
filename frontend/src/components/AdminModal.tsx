import axios from "axios";
import React, { useEffect, useState } from "react";
import { Profile } from "../features/profile/login";
import { fetchStatus } from "../features/record/status";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Navigate } from "react-router-dom";

function ModalContent({ onClose }: any) {
  const [userData, setUserData] = useState<Profile>({
    email: "",
    login: "",
    name: "",
    phone: "",
    position: "",
    adminRole: false,
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
            mutation CreateProfile($login: String!, $name: String!, $position: String!, $email: String!, $phone: String!, $adminRole: Boolean!) {
              createProfile(login: $login, name: $name, position: $position, email: $email, phone: $phone, adminRole: $adminRole)
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
      ? successModal(response.data.data.createProfile)
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

  const handleAdminRoleChange = () => {
    setUserData((prevUserData) => ({
      ...prevUserData,
      adminRole: !userData.adminRole,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendRequest(userData);
  };

  return (
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <div className="form-container">
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
            <label>Admin role:</label>
            <input
              type="checkbox"
              name="adminRole"
              checked={userData.adminRole}
              onChange={handleAdminRoleChange}
            />
          </div>
          <div>
            <button type="submit">Register</button>
          </div>
        </form>
      </div>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default ModalContent;
