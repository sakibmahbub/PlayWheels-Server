const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("PlayWheels is running");
});

app.listen(port, () => {
  console.log(`PlayWheels is running on port ${port}`);
});
