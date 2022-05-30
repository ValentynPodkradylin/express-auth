const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./authRoutes");

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use("/auth", authRouter);

async function start() {
  try {
    await mongoose.connect(
      "mongodb+srv://qwerty:qwertyqwerty@cluster0.vmwoolx.mongodb.net/auth?retryWrites=true&w=majority"
    );
    app.listen(PORT, () => console.log("good"));
  } catch (e) {
    console.log(e);
  }
}

start();
