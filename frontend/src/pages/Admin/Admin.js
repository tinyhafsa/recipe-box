import { useState, useEffect } from "react"; // react hooks
import Tabs from "../../components/Tabs/Tabs"; // tabs compnent
import "./Admin.css"; // styling
import { themes } from "../../themes/themes"; // themes
import { applyTheme } from "../../themes/applyTheme"; // theme management
import axios from "axios"; // HTTP requests

function Admin() {
  // controls - create, edit, delete user modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // user selected for editing or deleting
  const [selectedUser, setSelectedUser] = useState(null);

  // stores form input for creating and editing a user
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    isAdmin: false,
  });

  // selected tab
  const [currentTab, setCurrentTab] = useState("Users");
  // list of users
  const [users, setUsers] = useState([]);

  // logged-in admin info
  const user = JSON.parse(localStorage.getItem("user"));

  // calls backend api to get all users
  const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/users", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setUsers(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    // reusable headers for post, put and delete
    const authHeaders = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  // CREATE USER
  const handleCreateUser = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/admin/users",
        {
          ...formData,
          username: formData.email.split("@")[0], // simple default username
        },
        authHeaders
      );

      setShowCreateModal(false);
      setFormData({ email: "", password: "", isAdmin: false });
      fetchUsers(); // refresh list
    } catch (err) {
      console.error("Create user failed", err);
    }
  };


  // EDIT USER
  const handleEditUser = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/users/${selectedUser._id}`,
        formData,
        authHeaders
      );

      setShowEditModal(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      console.error("Edit user failed", err);
    }
  };

  // DELETE USER
  const handleDeleteUser = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/admin/users/${selectedUser._id}`,
        authHeaders
      );

      setShowDeleteModal(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      console.error("Delete user failed", err);
    }
  };

  // users are fetched when the tab is active
  useEffect(() => {
    if (currentTab === "Users") fetchUsers();
  }, [currentTab]);

  return (
    <div className="admin-body">

      {/* heading */}
      <div className="heading">
        <h1>Admin Dashboard</h1>
      </div>

      <div className="admin-container">
        {/* tabs */}
        <Tabs
          categories={["Users", "Themes"]}
          current={currentTab}
          onSelect={setCurrentTab}
          variant="vertical"
        />

        {/* user tab */}
        <div 
        style={{ flex: 1 }}
        className="admin-content-area">
          {currentTab === "Users" && (
            <>
              {/* user content */}
              <div className="admin-users-header">
                {/* heading */}
                <h2>Manage Users</h2>
                {/* create user button */}
                <button
                  className="admin-create-btn"
                  onClick={() => {
                    setFormData({ email: "", password: "", isAdmin: false });
                    setShowCreateModal(true);
                  }}
                >
                  + Create User
                </button>
              </div>
              {users.length === 0 ? (
                <p>No users found.</p>
              ) : (
                // user list
                <div className="user-list">
                  {users.map((u) => (
                    <div className="user-card" key={u._id}>
                      <div className="user-info">
                        <p><strong>ID:</strong> {u._id}</p>
                        <p><strong>Email:</strong> {u.email}</p>
                        <p>
                          <strong>Role:</strong>{" "}
                          {u.isAdmin ? "Admin" : "User"}
                        </p>
                      </div>

                      <div className="user-actions">
                        {/* buttons - edit */}
                        <button
                          className="edit-btn"
                          onClick={() => {
                            setSelectedUser(u);
                            setFormData({
                              email: u.email,
                              password: "",
                              isAdmin: u.isAdmin,
                            });
                            setShowEditModal(true);
                          }}
                        >
                          Edit
                        </button>

                        {/* buttons - delete */}
                        <button
                          className="delete-btn"
                          onClick={() => {
                            setSelectedUser(u);
                            setShowDeleteModal(true);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* themes tab */}
          {currentTab === "Themes" && (
            <>
              {/* heading */}
              <h2>Manage Themes</h2>
              {/* theme grid */}
              <div className="theme-grid">
                {Object.entries(themes).map(([key, theme]) => (
                  <div key={key} className="theme-card">
                    {/* theme name */}
                    <h3>{theme.name}</h3>
                    {/* preview image */}
                    <img
                      src={theme.preview}
                      alt={`${theme.name} theme preview`}
                      className="theme-preview"
                    />
                    {/* apply theme button */}
                    <button className="theme-btn" onClick={() => applyTheme(key)}>
                      Apply Theme
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Create User Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            {/* heading */}
            <h3>Create User</h3>
            {/* email */}
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            {/* password */}
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            {/* admin checkbox */}
            <label className="checkbox">
              <input
                type="checkbox"
                checked={formData.isAdmin}
                onChange={(e) =>
                  setFormData({ ...formData, isAdmin: e.target.checked })
                }
              />
              Admin user
            </label>
            {/* model buttons */}
            <div className="modal-actions">
              <button onClick={() => setShowCreateModal(false)}>Cancel</button>
              <button className="confirm-btn" onClick={handleCreateUser}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* edit user */}
      {showEditModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal">
            {/* heading */}
            <h3>Edit User</h3>
            {/* email */}
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            {/* password */}
            <input
              type="password"
              placeholder="New password (optional)"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            {/* admin checkbox */}
            <label className="checkbox">
              <input
                type="checkbox"
                checked={formData.isAdmin}
                onChange={(e) =>
                  setFormData({ ...formData, isAdmin: e.target.checked })
                }
              />
              Admin user
            </label>
            {/* buttons */}
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button className="confirm-btn" onClick={handleEditUser}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* delete user */}
      {showDeleteModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal">
            {/* heading */}
            <h3>Delete User</h3>
            <p>
              Are you sure you want to delete{" "}
              <strong>{selectedUser.email}</strong>?
            </p>
            {/* buttons */}
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="delete-btn" onClick={handleDeleteUser}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
// export
export default Admin;