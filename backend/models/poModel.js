import mongoose from "mongoose";

const poSchema = mongoose.Schema(
    {
        number: {
            type: String,
            required: true
        },
        name: {
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
        }
    },
    {
        timestamps: true
    }
);

export const PO = mongoose.model('PO' , poSchema);