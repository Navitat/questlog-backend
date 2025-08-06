require("dotenv").config();

require("./db");

const express = require("express");

const app = express();

require("./config")(app);

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

const questRoutes = require("./routes/quest.routes");
app.use("/api", questRoutes);

const userRoutes = require("./routes/user.routes");
app.use("/api", userRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

require("./error-handling")(app);

module.exports = app;
