import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import Navbar from "../components/navbar.jsx";
import Modal from "../components/modal.jsx";

import { jwtDecode } from "jwt-decode";
import Confirmation from "../components/confirmation.jsx";

const Users = () => {
  const location = useLocation();
  const db = new URLSearchParams(location.search).get("db");
  const [currentUser, setCurrentUser] = useState();
  const [currentUsername, setCurrentUsername] = useState();
  const [users, setUsers] = useState([]);
  const [superUsers, setSuperUsers] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddSuperModalOpen, setIsAddSuperModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditSuperModalOpen, setIsEditSuperModalOpen] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [deleteUsername, setDeleteUsername] = useState("");
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  useEffect(() => {
    fetchUsers("general");
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setCurrentUser(decodedToken.role);
        setCurrentUsername(decodedToken.username);
        console.log("user role is", decodedToken.role);
        console.log("username is", decodedToken.username);
        if (decodedToken.role === "super") {
          fetchUsers("super");
        }
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    }
  }, [location.search]);

  const fetchUsers = async (userRole) => {
    await axios
      .get(
        `${window.location.protocol}//${window.location.hostname}:${window.location.port}/login_be/${userRole}?db=${db}`
      )
      .then((res) => {
        if (userRole === "super") {
          setSuperUsers(res.data.recordset);
        } else {
          setUsers(res.data.recordset);
        }
      })
      .catch((error) => {
        console.log("le error is " + error);
      });
  };

  const handleAddUser = async (e, userRole) => {
    await axios.post(
      `${window.location.protocol}//${window.location.hostname}:${window.location.port}/login_be/newuser?db=${db}&userRole=${userRole}`,
      e
    );
    fetchUsers();
    setIsAddModalOpen(false);
    setIsAddSuperModalOpen(false);
    console.log("added user", e);
  };

  const handleDelete = () => {
    axios
      .delete(
        `${window.location.protocol}//${window.location.hostname}:${
          window.location.port
        }/login_be/${encodeURIComponent(
          deleteUsername
        )}?db=${db}&userRole=${currentUser}`
      )
      .catch((error) => {
        console.log("Error deleting item: " + error);
      });
    setIsConfirmationOpen(false);
  };

  const handleEditUser = async (e, userRole) => {
    e.username = editUsername;
    console.log(e, "and", userRole);
    setIsEditModalOpen(false);
    setIsEditSuperModalOpen(false);
    await axios.put(
      `${window.location.protocol}//${window.location.hostname}:${window.location.port}/login_be/edituser?db=${db}&userRole=${userRole}`,
      e
    );
  };

  return (
    <div>
      <Navbar />
      <div className="topbar">
        <h1 className="title">User Management</h1>
      </div>

      {db === "sw" ? (
        <h2 className="user_management_title">Software Lab Users</h2>
      ) : (
        <h2 className="user_management_title">Hardware Lab Users</h2>
      )}

      <div className="user-table">
        <button
          onClick={() => {
            setIsAddModalOpen(true);
          }}
          className="add_user_button"
        >
          Add User
        </button>
        <div className="inventory_table">
          <table className="inventory-table">
            <thead>
              <tr>
                <th
                  className="table-header-title"
                  style={{ fontWeight: "bold" }}
                >
                  Username
                </th>
                <th
                  className="table-header-title"
                  style={{ fontWeight: "bold" }}
                >
                  Password
                </th>
                <th
                  className="table-header-title"
                  style={{ fontWeight: "bold" }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="inventory-table-body">
              {users.map((item, index) => (
                <tr key={index}>
                  {}
                  <td>{item.username}</td>
                  <td>
                    {currentUser === "general" &&
                    currentUsername != item.username ? (
                      <>********</>
                    ) : (
                      <>{item.password}</>
                    )}
                  </td>
                  <td>
                    <div className="user-actions">
                      {currentUser === "general" &&
                      currentUsername != item.username ? (
                        <></>
                      ) : (
                        <>
                          <MdModeEditOutline
                            title="Edit"
                            onClick={() => {
                              setIsEditModalOpen(true);
                              setEditUsername(item.username);
                            }}
                            style={{ cursor: "pointer" }}
                          />
                          <MdDelete
                            title="Delete"
                            undefined
                            onClick={() => {
                              setIsConfirmationOpen(true);
                              setDeleteUsername(item.username);
                            }}
                            style={{ cursor: "pointer" }}
                          />
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <br />
      <br />

      {currentUser === "super" && (
        <>
          <div className="user-table">
            <h2 className="user_management_title">Super Users</h2>
            <button
              onClick={() => {
                setIsAddSuperModalOpen(true);
              }}
              className="add_user_button"
            >
              Add Super User
            </button>
            <div className="inventory_table">
              <table className="inventory-table">
                <thead>
                  <tr>
                    <th
                      className="table-header-title"
                      style={{ fontWeight: "bold" }}
                    >
                      Username
                    </th>
                    <th
                      className="table-header-title"
                      style={{ fontWeight: "bold" }}
                    >
                      Password
                    </th>
                    <th
                      className="table-header-title"
                      style={{ fontWeight: "bold" }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="inventory-table-body">
                  {superUsers.map((item, index) => (
                    <tr key={index}>
                      {}
                      <td>{item.username}</td>
                      <td>{item.password}</td>

                      <td>
                        <div className="user-actions">
                          <MdModeEditOutline
                            title="Edit"
                            onClick={() => {
                              setIsEditSuperModalOpen(true);
                              setEditUsername(item.username);
                            }}
                            style={{ cursor: "pointer" }}
                          />
                          <MdDelete
                            title="Delete"
                            undefined
                            onClick={() => {
                              setIsConfirmationOpen(true);
                              setDeleteUsername(item.username);
                            }}
                            style={{ cursor: "pointer" }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <Modal
        isOpen={isAddModalOpen}
        onSubmit={(e) => handleAddUser(e, "general")}
        onCancel={() => {
          setIsAddModalOpen(false);
        }}
      />

      <Modal
        isOpen={isAddSuperModalOpen}
        onSubmit={(e) => handleAddUser(e, "super")}
        onCancel={() => {
          setIsAddSuperModalOpen(false);
        }}
      />

      <Modal
        isOpen={isEditModalOpen}
        onSubmit={(e) => handleEditUser(e, "general")}
        onCancel={() => {
          setIsEditModalOpen(false);
        }}
        editUsername={editUsername}
      />

      <Modal
        isOpen={isEditSuperModalOpen}
        onSubmit={(e) => handleEditUser(e, "super")}
        onCancel={() => {
          setIsEditSuperModalOpen(false);
        }}
        editUsername={editUsername}
      />

      <Confirmation
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onSubmit={handleDelete}
        message={"Confirm to Delete user?"}
      />
    </div>
  );
};

export default Users;
