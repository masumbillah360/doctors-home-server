const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const colors = require("colors");
const cors = require("cors");
const app = express();
//midlewere
app.use(cors());
app.use(express.json());
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
    const Booking = client.db(process.env.DB_NAME).collection("bookings");
    const Users = client.db(process.env.DB_NAME).collection("users");
    app.get("/slots", async (req, res) => {
      const date = req.query.date;
      const query = {};
      const options = await slotCollection.find(query).toArray();
      const bookingQuery = { bookingDate: date };
      const alreadyBooked = await Booking.find(bookingQuery).toArray();
      options.forEach((option) => {
        const optionBooked = alreadyBooked.filter(
          (book) => book.treatmentName === option.name
        );
        const bookedSlots = optionBooked.map((book) => book.slot);
        const remainingSlots = option.slots.filter(
          (slot) => !bookedSlots.includes(slot)
        );
        option.slots = remainingSlots;
        console.log(remainingSlots.length);
      });

      res.send(options);
    });
    app.post("/bookings", async (req, res) => {
      const bookingInfo = req.body;
      const query = {
        bookingDate: bookingInfo.bookingDate,
        treatmentName: bookingInfo.treatmentName,
        email: bookingInfo.email,
      };
      const alreadyBooked = await Booking.find(query).toArray();
      if (alreadyBooked.length) {
        const message = `You Already Have a Booking on ${bookingInfo.treatmentName}`;
        return res.send({ acknowledged: false, message });
      }
      console.log(bookingInfo);
      const data = await Booking.insertOne(bookingInfo);
      res.send(data);
    });
    app.get("/bookings", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const data = await Booking.find(query).toArray();
      res.send(data);
    });
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await Users.insertOne(user);
      res.send(result);
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
