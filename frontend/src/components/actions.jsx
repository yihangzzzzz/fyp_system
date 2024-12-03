// src/components/StatusDropdown.js
// const MdOutlineAddBox = require('react-icons/md/MdOutlineAddBox');
// const MdModeEditOutline = require('react-icons/md/MdModeEditOutline');
// const MdDelete = require('react-icons/md/MdDelete');

// const React = require('react');
// const { useState } = React;
// const { MdOutlineAddBox, MdModeEditOutline, MdDelete } = require('react-icons/md');
// const axios = require('axios');
// const Confirmation = require('./confirmation');
// const { useNavigate } = require('react-router-dom');

import React, { useState } from "react";
import { MdOutlineAddBox, MdModeEditOutline, MdDelete } from "react-icons/md";
import axios from "axios";
import Confirmation from "./confirmation";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { BiTransfer } from "react-icons/bi";

const Actions = ({ toDelete, toEdit, toTransfer, mode }) => {
  const location = useLocation();
  const db = new URLSearchParams(location.search).get("db");
  const navigate = useNavigate();
  const [deleteItemName, setDeleteItemName] = useState(toDelete);
  const [editItemName, setEditItemName] = useState(toEdit);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const handleDelete = () => {
    if (mode === "inventory") {
      axios
        .delete(
          `${window.location.protocol}//${window.location.hostname}:${
            window.location.port
          }/inventory_be/${encodeURIComponent(deleteItemName)}?db=${db}`
        )
        .catch((error) => {
          console.log("Error deleting item: " + error);
        });
      setIsConfirmationOpen(false);
      navigate(`/inventory?db=${db}`);
    } else if (mode === "user") {
      axios
        .delete(
          `${window.location.protocol}//${window.location.hostname}:${
            window.location.port
          }/login_be/${encodeURIComponent(toDelete)}?db=${db}`
        )
        .catch((error) => {
          console.log("Error deleting item: " + error);
        });
      setIsConfirmationOpen(false);
      navigate(`/users?db=${db}`);
    }
  };

  const handleEdit = () => {
    if (mode === "inventory") {
      navigate(
        `/inventory/edititem/${encodeURIComponent(editItemName)}?db=${db}`
      );
    } else if (mode === "user") {
    }
  };

  return (
    <div className="inventory_actions">
      <MdModeEditOutline title="Edit" onClick={handleEdit} />
      <MdDelete onClick={() => setIsConfirmationOpen(true)} title="Delete" />
      {mode === "inventory" ? (
        <>
          <BiTransfer
            onClick={() =>
              navigate(`/transfers/newtransfer?db=${db}&itemID=${toTransfer}`)
            }
          />
        </>
      ) : (
        <></>
      )}
      <Confirmation
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onSubmit={handleDelete}
        message={"Confrim to delete item from inventory?"}
      />
    </div>
  );
};

export default Actions;
