import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar.jsx";
import axios from "axios";

import Confirmation from "../components/confirmation.jsx";

import { useLocation } from "react-router-dom";

const NewItem = ({}) => {
  const location = useLocation();
  const db = new URLSearchParams(location.search).get("db");

  const [loading, setLoading] = useState(false);
  const [newItem, setNewItem] = useState({
    picture: "",
    name: "",
    serial: null,
    quantity: null,
    description: "",
  });
  const navigate = useNavigate();

  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const formData = new FormData();
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {}, []);

  const handleAddItem = () => {
    formData.append("picture", newItem.picture);
    formData.append("name", newItem.name);

    formData.append("quantity", newItem.quantity);
    formData.append("description", newItem.description);

    axios
      .post(
        `${window.location.protocol}//${window.location.hostname}:${window.location.port}/inventory_be/newitem?db=${db}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error adding item: " + error);
        setLoading(false);
      });

    navigate(`/inventory?db=${db}`);
    window.location.reload();
  };

  const handleNewItemChange = (e, info) => {
    setNewItem((prevState) => ({
      ...prevState,
      [info]: e,
    }));
  };

  const handleImageChange = (e) => {
    setNewItem((prevState) => ({
      ...prevState,
      picture: e,
    }));

    const file = e;

    const reader = new FileReader();
    reader.onload = (event) => {
      console.log(reader.result);
      setImagePreview(reader.result);
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = 100;
        canvas.height = 100;

        ctx.drawImage(img, 0, 0, 100, 100);

        canvas.toBlob(
          (blob) => {
            const resizedFile = new File([blob], file.name, {
              type: blob.type,
            });
            setNewItem((prevState) => ({
              ...prevState,
              picture: resizedFile,
            }));
          },
          file.type,
          1
        );
      };
    };

    reader.readAsDataURL(file);
  };

  return (
    <div>
      <Navbar />
      <div className="topbar">
        <h1 className="title">Add New Item</h1>
      </div>
      <div className="order_table">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setIsConfirmationOpen(true);
          }}
        >
          <div className="transfer_info_main">
            <div className="transfer_info">
              <div className="transfer-info-input">
                <label htmlFor="image">Upload Image</label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e.target.files[0])}
                />
                {imagePreview && (
                  <div>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        width: "200px",
                        height: "auto",
                        marginTop: "10px",
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="transfer-info-input">
                <label>Item Name</label>
                <textarea
                  type="text"
                  value={newItem.name}
                  onChange={(e) => handleNewItemChange(e.target.value, "name")}
                  required
                />
              </div>
              <div className="transfer-info-input">
                <label>Quantity</label>
                <input
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) =>
                    handleNewItemChange(e.target.value, "quantity")
                  }
                  required
                />
              </div>
              <div className="transfer-info-input">
                <label>Description</label>
                <textarea
                  type="description"
                  value={newItem.description}
                  onChange={(e) =>
                    handleNewItemChange(e.target.value, "description")
                  }
                />
              </div>
            </div>
          </div>

          <button className="submit-button" type="submit">
            Submit
          </button>
        </form>
      </div>
      <Confirmation
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onSubmit={handleAddItem}
        message={"Confirm to Add New Item?"}
      />
    </div>
  );
};

export default NewItem;
