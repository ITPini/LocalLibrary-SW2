const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render("index"); // index refers to index.ejs
});

app.listen(3000, () => {
    console.log("server started on port 3000");
});

app.post("/login", (req, res) => {
    const { name, password } = req.body;
  
    if (name === "admin" && password === "admin") {
      res.render("login/success", {
        username: name,
      });
    } else {
      res.render("login/failure");
    }
  });