import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Profile } from "../features/profile/login";
import { userList } from "../features/profile/profiles";
import ModalContent from "./AdminModal";

const ProfilesAdmin = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.userList); // Подставь свой state

  const updateUser = (args: any) => {};

  const login = localStorage.getItem("login") || "";

  useEffect(() => {
    dispatch(userList(login));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleSaveChanges = () => {
    updateUser(selectedUser);
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

  return (
    <div className="main-content container-flex">
      {isModalOpen && (
        <div className="modal-background" onClick={handleCloseModal}>
          <ModalContent onClose={handleCloseModal} />
        </div>
      )}
      <div>
        <table className="styled-table">
          <tbody>
            <tr>
              <th>Email</th>
              <th>Login</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Position</th>
              <th>Admin Role</th>
            </tr>
            {users.response.map((user: Profile) => (
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
        <button onClick={handleOpenModal}>Create New Profile</button>
      </div>

      {selectedUser.active ? (
        <div className="form-container">
          <form style={{ margin: "5%" }}>
            <div>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={selectedUser.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Login:</label>
              <input
                type="text"
                name="login"
                value={selectedUser.login}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={selectedUser.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Phone:</label>
              <input
                type="text"
                name="phone"
                value={selectedUser.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Position:</label>
              <input
                type="text"
                name="position"
                value={selectedUser.position}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Admin Role:</label>
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
            </div>
            <button type="button" onClick={handleSaveChanges}>
              Save changes
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
};

export default ProfilesAdmin;
