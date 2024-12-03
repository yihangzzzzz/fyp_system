import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/navbar.jsx";
import Confirmation from "../components/confirmation.jsx";
import { useLocation } from "react-router-dom";

const EditItem = () => {
  const location = useLocation();
  const db = new URLSearchParams(location.search).get("db");

  const navigate = useNavigate();
  const { itemID } = useParams();
  const [item, setItem] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchItem();
  }, []);

  const fetchItem = async () => {
    setLoading(true);
    await axios
      .get(
        `${window.location.protocol}//${window.location.hostname}:${
          window.location.port
        }/inventory_be/${encodeURIComponent(itemID)}?db=${db}`
      )
      .then((res) => {
        setItem(res.data.recordset[0]);
        setLoading(false);
      })
      .catch((error) => {
        console.log("le error is " + error);
        setLoading(false);
      });
  };
  const handleItemChange = (e, info) => {
    setItem((prevState) => ({
      ...prevState,
      [info]: e,
    }));
  };

  const handleImageChange = (e) => {
    setItem((prevState) => ({
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
            setItem((prevState) => ({
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

  const handleSaveItemChanges = async () => {
    try {
      await axios.put(
        `${window.location.protocol}//${window.location.hostname}:${
          window.location.port
        }/inventory_be/${encodeURIComponent(itemID)}?db=${db}`,
        item,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (error) {
      console.error("Error updating items:", error);
    }
    navigate(`/inventory?db=${db}`);
  };

  return (
    <div>
      <Navbar />
      <div className="topbar">
        <h1 className="title">Edit Item</h1>
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
              <div className="input-box">
                <h5 htmlFor="image">Upload Image</h5>
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
              <div className="input-box">
                <h5>Item Name</h5>
                <textarea
                  type="text"
                  value={item.itemName}
                  onChange={(e) => handleItemChange(e.target.value, "itemName")}
                  style={{ outline: "2px solid black" }}
                  required
                />
              </div>
              <div className="input-box">
                <h5>Description</h5>
                <textarea
                  type="text"
                  value={item.description}
                  onChange={(e) =>
                    handleItemChange(e.target.value, "description")
                  }
                  style={{ outline: "2px solid black", width: "500px" }}
                />
              </div>
              <div className="input-box">
                <h5>Cabinet</h5>
                <input
                  type="number"
                  value={item.cabinet}
                  onChange={(e) => handleItemChange(e.target.value, "cabinet")}
                  style={{ outline: "2px solid black" }}
                  required
                />
              </div>
              <div className="input-box">
                <h5>Counter</h5>
                <input
                  type="number"
                  value={item.counter}
                  onChange={(e) => handleItemChange(e.target.value, "counter")}
                  style={{ outline: "2px solid black" }}
                />
              </div>
              <div className="input-box">
                <h5>Remarks</h5>
                <textarea
                  type="textarea"
                  value={item.remarks}
                  onChange={(e) => handleItemChange(e.target.value, "remarks")}
                  style={{ outline: "2px solid black", width: "500px" }}
                />
              </div>
            </div>
          </div>

          <button className="submit-button" type="submit">
            Save
          </button>
        </form>
      </div>
      <Confirmation
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onSubmit={handleSaveItemChanges}
        message={"Confirm to Save item details?"}
      />
    </div>
  );
};

export default EditItem;
