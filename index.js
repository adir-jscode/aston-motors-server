const express = require("express");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xyztv.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    console.log("connected to aston database");

    const partsCollection = await client.db("aston-motors").collection("parts");
    const purchaseCollection = await client
      .db("aston-motors")
      .collection("purchase");

    /* PARTS COLLECTION */

    //get all parts

    app.get("/part", async (req, res) => {
      const result = await partsCollection.find().toArray();
      res.send(result);
    });

    //get specific parts details

    app.get("/part/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await partsCollection.findOne(filter);
      res.send(result);
    });

    /* Confirm Purchase Collection*/

    // add purchase

    app.post("/purchase", async (req, res) => {
      const data = req.body;
      const result = await purchaseCollection.insertOne(data);
      res.send(result);
    });

    //get specific Confirmed purchase by user email

    app.get("/purchase", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await purchaseCollection.find(query).toArray();
      res.send(result);
    });
  } finally {
    //await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello from aston!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
