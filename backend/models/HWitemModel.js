import mongoose from "mongoose";

const itemSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        serial: {
            type: String,
            required: true

        },
        category: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        ordered: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

export const hwItem = mongoose.model('hardware_item' , itemSchema);