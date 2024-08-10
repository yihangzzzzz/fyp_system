import mongoose from "mongoose";

const partSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        serial: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export const Part = mongoose.model('Part' , { name : String, serial: Number});