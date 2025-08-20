const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Service title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters long"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Service description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters long"],
    },
    requiredDocuments: {
      type: [String],
      default: [],
      validate: {
        validator: function (docs) {
          return Array.isArray(docs);
        },
        message: "Required documents must be an array of strings",
      },
    },
    fee: {
      type: Number,
      default: 0,
      min: [0, "Fee cannot be negative"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", //* means it references the User model.
      required: [true, "CreatedBy (User reference) is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
