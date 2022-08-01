require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIP_SECRET_KEY);
const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

app.post("./pay", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name)
      return res.status(400).json({ message: "Please Enter the Name" });
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(25 * 100),
      currency: "USD",
      payment_method_types: ["card"],
      metadata: { name: name },
    });
    const clientSecret = paymentIntent.client_secret;
    res.json({ message: "Payment Initiated", clientSecret });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(PORT, () => console.log(`https://localhost:${PORT}`));
