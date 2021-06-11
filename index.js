const express = require("express");
const app = express();
const http = require("http").Server(app);
const cookieParser = require("cookie-parser");
const glob = require("glob");
const path = require("path");
const ResponseHandler = require("./utils/responseHandler");

const PORT = process.env.PORT || 8000;

// APPLICATION MIDDLEWARES
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use(express.json({ limit: "500kb" }));
app.use(express.urlencoded({ limit: "500kb", extended: false }));
app.use(cookieParser());

// AUTO REQUIRE MAIN CONTROLLERS
glob.sync("./controllers/*.js").forEach(function (file) {
  app.use(`/${path.parse(file)["name"]}`, require(path.resolve(file)));
});

// 404 ERROR HANDLER
app.use((req, res) => {
  const response = new ResponseHandler(req, res);
  return response.setMsg("Invalid request", "error").send();
});

// SERVER PORT IMPLEMENTATION
http.listen(PORT, () => {
  console.log("Server is running on port ", PORT);
});
