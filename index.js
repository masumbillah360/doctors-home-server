const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const colors = require("colors");
const cors = require("cors");
const app = express();
require("dotenv").config();
app.get("/", async (req, res) => {
  res.send("Server Is Running");
});

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.pwgovse.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
const dbRunner = async () => {
  try {
    const slotCollection = client.db(process.env.DB_NAME).collection("slots");
    app.get("/slots", async (req, res) => {
      const query = {};
      const data = await slotCollection.find(query).toArray();
      res.send(data);
      console.log("hitted the slots".blue.bgWhite);
    });
  } catch (error) {}
};
dbRunner().catch((err) => console.log(err));
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`app is running on port ${port}`.red);
  console.log(uri.green);
});
//doctors-home
//Doctors-Home
