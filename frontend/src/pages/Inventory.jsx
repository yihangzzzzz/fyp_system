import { useEffect, useState } from "react"
import React from 'react'
import axios from "axios"
import spinner from "../components/spinner";
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';

const Inventory = () => {
    const [parts, setParts] = useState([]);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        setLoading(true);
        axios
            .get("http://localhost:3000/parts")
            .then((res) => {
                setParts(res.data);
                setLoading('tututu');
            })
            .catch((error) => {
                console.log("le error is " + error);
            })
    }, []);

    return (
        <div>
            <div className='topbar'>
                <h1 className="title">Parts List</h1>
                <Link to='/inventory/add'>
                    <MdOutlineAddBox className='addButton' />
                </Link>
            </div>
            <div className="items_container">
                <h2>{"state is " + loading}</h2>
                <h2>{parts[1].name}</h2>
            </div>
        </div>

    );
}

export default Inventory