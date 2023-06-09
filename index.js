const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y4fhbtl.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    client.connect();

    const toyCollection = client.db("playwheels").collection("toys");

    app.get("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toyCollection.findOne(query);
      res.send(result);
    });

    app.get("/toys", async (req, res) => {
      const { email, sort } = req.query;
      const limit = 20;
      const query = email ? { email: email } : {};
      const cursor = toyCollection.find(query).limit(limit);

      try {
        if (sort === "asc") {
          cursor.sort({ price: 1 });
        } else if (sort === "desc") {
          cursor.sort({ price: -1 });
        }

        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        console.error("Toys not available:", error);
        res.status(500).send("Toys not available");
      }
    });

    app.post("/toys", async (req, res) => {
      const toy = req.body;
      console.log(toy);
      const result = await toyCollection.insertOne(toy);
      res.send(result);
    });

    app.delete("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toyCollection.deleteOne(query);
      res.send(result);
    });

    app.put("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const updatedToy = req.body;

      try {
        const query = { _id: new ObjectId(id) };
        const result = await toyCollection.updateOne(query, {
          $set: updatedToy,
        });
        res.send(result);
      } catch (error) {
        console.error("failed updating toy:", error);
        res.status(500).send("failed updating toy");
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("PlayWheels is running");
});

app.listen(port, () => {
  console.log(`PlayWheels is running on port ${port}`);
});
