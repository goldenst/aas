const express = require("express");
const connectDB = require("./config/db");

const app = express();

// connect DB
connectDB();

// init middleware
app.use(express.json({ extended: false }));


app.get("/", (req, res) => res.send("API Running"));

// Define Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/drivers", require("./routes/api/drivers"));
app.use("/api/weekley", require("./routes/api/weekleyTech"));
app.use("/api/saftey", require("./routes/api/safteyTech"));
app.use("/api/profiles", require("./routes/api/profiles"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server Started on Port: ${PORT}`));
