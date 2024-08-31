import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/navbar';
import Confirmation from '../components/confirmation'
import { useNavigate } from 'react-router-dom';

export const EditItem = () => {

    const navigate = useNavigate();
    const { itemName } = useParams();
    const [item, setItem] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

    useEffect(() => {
        fetchItem();
    }, []);

    const fetchItem = async () => {
        setLoading(true);
        await axios
        .get(`http://localhost:3000/inventory/${encodeURIComponent(itemName)}`)
        .then((res) => {
            setItem(res.data.recordset[0]);
            setLoading(false);
        })
        .catch((error) => {
            console.log("le error is " + error);
            setLoading(false);
        });
    }
    const handleItemChange = (e, info) => {
        setItem(prevState => ({
            ...prevState,
            [info]: e  // Replace with the new value for destination
        }));
        console.log(item)
      }
      
      const handleImageChange = (e) => {
        setItem(prevState => ({
            ...prevState,
            picture: e  // Replace with the new value for destination
        }));
      }

    const handleSaveItemChanges = async () => {
        console.log(item);
        try {
            await axios
            .put(`http://localhost:3000/inventory/${encodeURIComponent(itemName)}`, item, {
                headers: {
                  "Content-Type": "multipart/form-data"
                }
              }) 
        } catch (error) {
            console.error('Error updating items:', error);
          }
        navigate('/inventory');
    }

    return (
        <div>
            <Navbar />
            <div className='topbar'>
                <h1 className="title">Edit Item</h1>
            </div>
            <div className='order_table'>
                <div>
                    <h5 htmlFor='image'>Upload Image</h5>
                    <input
                        type='file'
                        id='image'
                        accept='image/*'
                        onChange={(e) => handleImageChange(e.target.files[0])}
                    />
                    <img width="100" height="100" src={"http://localhost:3000/images/" + item.picture} />
                </div>
                <div className='input-box'>
                    <h5>Item Name</h5>
                    <input
                        type="text"
                        value={item.itemName}
                        onChange={(e) => handleItemChange(e.target.value, 'itemName')}
                        style={{ outline: '2px solid black' }}
                    />
                </div>
                <div className='input-box'>
                    <h5>Serial Number</h5>
                    <input
                        type="number"
                        value={item.serialNumber}
                        onChange={(e) => handleItemChange(e.target.value, 'serialNumber')}
                        style={{ outline: '2px solid black' }}
                    />
                </div>
                <div className='input-box'>
                    <h5>Quantity</h5>
                    <input
                        type="number"
                        value={item.cabinet}
                        onChange={(e) => handleItemChange(e.target.value, 'cabinet')}
                        style={{ outline: '2px solid black' }}
                    />
                </div>
                <button className="submit-button" type="submit" onClick={() => setIsConfirmationOpen(true)}>Save</button>
                <button className="cancel-button" type="submit" onClick={() => navigate(`/inventory`)}>Cancel</button>
            </div>
            <Confirmation
            isOpen={isConfirmationOpen}
            onClose={() => setIsConfirmationOpen(false)}
            onSubmit={handleSaveItemChanges}/>
        </div>
    )
}

export default EditItem