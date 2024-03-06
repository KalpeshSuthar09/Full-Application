const mongoose = require("mongoose");

const newPartnerSchema = new mongoose.Schema(
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

const newPartnerModel = mongoose.model("newPartner", newPartnerSchema);

module.exports = newPartnerModel;
