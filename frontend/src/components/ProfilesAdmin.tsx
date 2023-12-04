import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Profile } from "../features/profile/login";
import { userList } from "../features/profile/profiles";
import ModalContent from "./AdminModal";
import simpleRequest from "../features/simpleSend";
import { Navigate } from "react-router-dom";

const ProfilesAdmin = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<string>("");
  const statusAllowed = useAppSelector((state) => state.recordStatus);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.userList);

  const login = localStorage.getItem("login") || "";

  useEffect(() => {
    dispatch(userList());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const [selectedUser, setSelectedUser] = useState({
    email: "",
    login: "",
    name: "",
    phone: "",
    position: "",
    adminRole: false,
    active: false,
  });

  const handleTableRowClick = (user: React.SetStateAction<Profile>) => {
    setSelectedUser((prevUser) => ({
      ...prevUser,
      ...user,
      active: true,
    }));
  };

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    setSelectedUser({
      ...selectedUser,
      [e.target.name]: e.target.value,
      active: true,
    });
  };

  const handleSaveChanges = async () => {
    await simpleRequest.profile.updateUser(selectedUser);

    dispatch(userList());

    setSelectedUser({
      email: "",
      login: "",
      name: "",
      phone: "",
      position: "",
      adminRole: false,
      active: false,
    });
  };

  const handleDelete = async () => {
    await simpleRequest.profile.deleteUser(selectedUser.login);

    dispatch(userList());

    setSelectedUser({
      email: "",
      login: "",
      name: "",
      phone: "",
      position: "",
      adminRole: false,
      active: false,
    });
  };

  const filteredRecords = users.response.filter((record) =>
    record.name.toLowerCase().includes(filter.toLowerCase())
  );

  if (!statusAllowed.status.adminRole) {
    return <Navigate replace to="/login" />;
  } else {
    return (
      <div className="main-content container-flex">
        {isModalOpen && (
          <div className="modal-background" onClick={handleCloseModal}>
            <ModalContent onClose={handleCloseModal} />
          </div>
        )}
        <div className="full-heigh">
          <input
            className="custom-filter"
            type="text"
            placeholder="Filter by name"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <button onClick={handleOpenModal}>Create New Profile</button>
          {users.loading && <div>Loading...</div>}
          {!users.loading && users.error ? (
            <div>Error: {users.error}</div>
          ) : null}
          {!users.loading && filteredRecords.length ? (
            <div className="styled-table-container">
              <table className="styled-table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Login</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Position</th>
                    <th>Admin Role</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((user: Profile) => (
                    <tr
                      key={user.login}
                      onClick={() => handleTableRowClick(user)}
                      className="table-row"
                    >
                      <td>{user.email}</td>
                      <td>{user.login}</td>
                      <td>{user.name}</td>
                      <td>{user.phone}</td>
                      <td>{user.position}</td>
                      <td>{user.adminRole ? "Yes" : "No"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>

        {selectedUser.active ? (
          <div className="form-container">
            <h3>Edit profile "{selectedUser.login}"</h3>
            <form>
              <div className="form-input">
                <input
                  className="input-field"
                  type="email"
                  name="email"
                  value={selectedUser.email}
                  onChange={handleInputChange}
                  required
                />
                <label className="input-label">Email:</label>
              </div>

              <div className="form-input">
                <input
                  className="input-field"
                  type="text"
                  name="name"
                  value={selectedUser.name}
                  onChange={handleInputChange}
                  required
                />
                <label className="input-label">Name:</label>
              </div>
              <div className="form-input">
                <input
                  className="input-field"
                  type="text"
                  name="phone"
                  value={selectedUser.phone}
                  onChange={handleInputChange}
                  required
                />
                <label className="input-label">Phone:</label>
              </div>
              <div className="form-input">
                <input
                  className="input-field"
                  type="text"
                  name="position"
                  value={selectedUser.position}
                  onChange={handleInputChange}
                  required
                />
                <label className="input-label">Position:</label>
              </div>
              <div className="form-input">
                <input
                  type="checkbox"
                  name="adminRole"
                  checked={selectedUser.adminRole}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      adminRole: e.target.checked,
                    })
                  }
                />
                <label>Admin Role:</label>
              </div>
              <div className="container-flex">
                <button type="button" onClick={handleSaveChanges}>
                  Save changes
                </button>
                <button
                  type="button"
                  className="warn-button"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </form>
          </div>
        ) : null}
      </div>
    );
  }
};

export default ProfilesAdmin;
