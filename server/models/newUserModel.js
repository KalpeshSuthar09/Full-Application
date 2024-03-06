const mongoose = require("mongoose");

const newUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'partner',
    },
  },
  {
    timestamps: true,
  }
);

const newUserModel = mongoose.model("newUser", newPartnerSchema);

module.exports = newPartnerModel;
