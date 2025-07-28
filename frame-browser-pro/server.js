const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const renderRoute = require("./routes/render");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(session({
  secret: "lunabotsecret",
  resave: false,
  saveUninitialized: true
}));

app.use("/", renderRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Frame Browser PRO running on http://localhost:${PORT}`);
});
