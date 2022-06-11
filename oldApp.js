const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();

const catalogRouter = require('./routes/catalog');

app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render("index"); // index refers to /views/index.ejs
});

app.listen(3000, () => {
    console.log("server started on port 3000");
});

app.use('/catalog', catalogRouter);

// Post with /login if name is admin and password is admin success and direct to routes/catalog else redirect to login/failure
app.post("/login", (req, res) => {
    const { name, password } = req.body;

    if (name === "admin" && password === "admin") {
        app.get('/routes/catalog', function(req, res) {
        res.send('Catalog');
      });
    } else {
        res.render("login/failure");
    }
});

/*
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
  */