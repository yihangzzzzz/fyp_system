import mongoose from "mongoose";

const sotckSchema = mongoose.Schema(
    {
        counter: {
            type: Number,
            required: true
        },
        warehouse: {
            type: Number,
            required: true
        }
    }
)

const labSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        id: {
            type: String,
            required: true
        },
        stock: {
            type: sotckSchema,
            required: true
        }
    }
)

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
        labs: {
            type: [labSchema],
            required: true
        }
    },
    {
        timestamps: true
    }
);

export const item = mongoose.model('item' , itemSchema);