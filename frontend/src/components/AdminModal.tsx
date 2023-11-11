import React, { useEffect, useState } from "react";
import { Profile } from "../features/profile/login";
import { fetchStatus } from "../features/record/status";
import { useAppDispatch } from "../app/hooks";
import { userList } from "../features/profile/profiles";
import simpleRequest from "../features/simpleSend";

function ModalContent({ onClose }: any) {
  const [userData, setUserData] = useState<Profile>({
    email: "",
    login: "",
    name: "",
    phone: "",
    position: "",
    adminRole: false,
  });

  const dispatch = useAppDispatch();

  const login = localStorage.getItem("login") || "";

  useEffect(() => {
    dispatch(fetchStatus(login));
  }, [dispatch, login]);

  const successModal = (login: string) => {};
  const issueModal = (message: string) => {};

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await simpleRequest.profile.createProfile(userData);
    dispatch(userList());
    onClose();
  };

  return (
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <form onSubmit={handleSubmit}>
        <div className="form-input">
          <input
            className="input-field"
            type="text"
            name="login"
            value={userData.login}
            onChange={handleChange}
            required
          />
          <label className="input-label">Login:</label>
        </div>
        <div className="form-input">
          <input
            className="input-field"
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            required
          />
          <label className="input-label">Email:</label>
        </div>

        <div className="form-input">
          <input
            className="input-field"
            type="text"
            name="name"
            value={userData.name}
            onChange={handleChange}
            required
          />
          <label className="input-label">Name:</label>
        </div>
        <div className="form-input">
          <input
            className="input-field"
            type="text"
            name="phone"
            value={userData.phone}
            onChange={handleChange}
            required
          />
          <label className="input-label">Phone:</label>
        </div>
        <div className="form-input">
          <input
            className="input-field"
            type="text"
            name="position"
            value={userData.position}
            onChange={handleChange}
            required
          />
          <label className="input-label">Position:</label>
        </div>

        <div className="form-input">
          <input
            className="input-field"
            type="checkbox"
            name="adminRole"
            checked={userData.adminRole}
            onChange={handleAdminRoleChange}
          />
          <label>Admin role:</label>
        </div>
        <div>
          <button type="submit">Register</button>
        </div>
      </form>
    </div>
  );
}

export default ModalContent;
