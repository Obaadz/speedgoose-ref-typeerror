import mongoose from "mongoose";
import { SpeedGooseCacheAutoCleaner } from "speedgoose";

const testSchema = new mongoose.Schema({
  pickup: {
    type: {
      location: {
        type: {
          type: String,
          enum: ["Point"],
          required: true,
        },
        coordinates: {
          type: [Number],
          required: true,
        },
      },
      formattedAddress: {
        type: String,
      },
      placeId: {
        type: String,
      },
    },
    default: {
      location: {
        type: "Point",
        coordinates: [0, 0],
      },
    },
  },
  dropoff: {
    type: {
      location: {
        type: {
          type: String,
          enum: ["Point"],
          required: true,
        },
        coordinates: {
          type: [Number],
          required: true,
        },
      },
      formattedAddress: {
        type: String,
      },
      placeId: {
        type: String,
      },
    },
    default: {
      location: {
        type: "Point",
        coordinates: [0, 0],
      },
    },
  },
});

testSchema.plugin(SpeedGooseCacheAutoCleaner);

testSchema.index({ "pickup.location": "2dsphere" });
testSchema.index({ "dropoff.location": "2dsphere" });

const TestModel = mongoose.model("Test", testSchema);

export default TestModel;
