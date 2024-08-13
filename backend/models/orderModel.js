import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
    {
        number: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        serial: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ['Pending', 'Fulfilled', 'Cancelled'],
            default: 'Pending'
            
        }
    },
    {
        timestamps: true
    }
);

export const Order = mongoose.model('Order' , orderSchema);