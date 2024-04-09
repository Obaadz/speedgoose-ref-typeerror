import mongoose from "mongoose";
import { applySpeedGooseCacheLayer } from "speedgoose";
import express from "express";
import TestModel from "./test.model.js";
import axios from "axios";

applySpeedGooseCacheLayer(mongoose, {
  redisUri: "redis://localhost:6378/3",
  debugConfig: {
    enabled: true,
  },
});

await mongoose.connect("mongodb://localhost:27018/test2");

await TestModel.deleteMany({});

const app = express();
app.use(express.json());

app.post("/tests", async (req, res) => {
  TestModel.create(req.body);
  res.status(204).send();
});
app.get("/tests", async (req, res) => {
  const tests = await TestModel.find({
    "pickup.location": {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [47.12345, -31.721123875],
        },
        $maxDistance: 1000,
      },
    },
  }).cacheQuery();
  res.json(tests);
});

app.listen(3001);

await axios.post("http://localhost:3001/tests", {
  pickup: {
    location: {
      type: "Point",
      coordinates: [47.12345, -31.721123875],
    },
    formattedAddress: "TEST",
    placeId: "111",
  },
  dropoff: {
    location: {
      type: "Point",
      coordinates: [27.12345, -21.721123875],
    },
    formattedAddress: "TEST2",
    placeId: "222",
  },
});

const response = await axios.get("http://localhost:3001/tests");

console.log("===========================");
console.log(response.data);
console.log("===========================");

console.log("OK!");
