import mongoose from "mongoose";

const evidenceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserCollection",
      required: true,
    },

    imagePath: {
      type: String,
      required: true,
      trim: true,
    },

    latitude: {
      type: Number,
      required: true,
    },

    longitude: {
      type: Number,
      required: true,
    },

    capturedAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const EvidenceCollection = mongoose.model("EvidenceCollection", evidenceSchema);

export default EvidenceCollection;