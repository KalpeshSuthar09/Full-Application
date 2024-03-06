const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const UserModel = require("./models/userModel");
const newPartnerModel = require('./models/newPartnerModel')
const newUserModel = require('./models/newUserModel')

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "HEAD","PATCH"],
    credentials: true,
  })
);
app.use(cookieParser());

//mongodb connection code
const mongoUrl =
  "mongodb+srv://PoodlesPetcare:PETCARE89898989@dashboards.zlm7idq.mongodb.net/?retryWrites=true&w=majority&appName=Dashboards";

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => console.log(e));

//custom api
app.listen(4000, () => {
  console.log("Server Started");
});

 app.post("/post", async (req, res) => {
  console.log(req.body);
}); 

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => {
      UserModel.create({ name, email, password: hash })
        .then((user) => res.json({ status: "OK" }))
        .catch((err) => res.json(err));
    })
    .catch((err) => res.json(err));
});

//login page api
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  UserModel.findOne({ email: email }).then((user) => {
    if (user) {
      bcrypt.compare(password, user.password, (err, response) => {
        if (response) {
          const token = jwt.sign(
            { email: user.email, role: user.role },
            "kalpesh",
            { expiresIn: "1d" }
          );
          res.cookie("token", token);
          return res.json({ status: "Ok", role: user.role });
        } else {
          return res.json("the password is incorrect");
        }
      });
    } else {
      return res.json("No record existed");
    }
  });
});

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json("token is missing");
  } else {
    jwt.json(token, "kalpesh", (err, decoded) => {
      if (err) {
        return res.json("Errors with token");
      } else {
        if (decoded.role === "admin") {
          next();
        } else {
          return res.json("not admin");
        }
      }
    });
  }
};

app.get("/dashboard", verifyUser, (req, res) => {
  res.json("Success");
});


//partner data
app.post("/new-partner", async (req, res) => {
  const { name, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => {
      newPartnerModel.create({ name, email, password: hash })
        .then((user) => res.json({ status: "OK" }))
        .catch((err) => res.json(err));
    })
    .catch((err) => res.json(err));
});


app.get("/new-partner", async (req, res) => {
  try {
    const allPartner = await Partner.find({});
    res.send({status: "ok", data: allPartner});
  } catch (error) {
    console.log(error);
  }
});

//user Data
app.post("/new-user", async (req, res) => {
  const { name, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => {
      newPartnerModel.create({ name, email, password: hash })
        .then((user) => res.json({ status: "OK" }))
        .catch((err) => res.json(err));
    })
    .catch((err) => res.json(err));
});

app.post("/login-user", (req, res) => {
  const { email, password } = req.body;
  newUserModel.findOne({ email: email }).then((user) => {
    if (user) {
      bcrypt.compare(password, user.password, (err, response) => {
        if (response) {
          const token = jwt.sign(
            { email: user.email, role: user.role },
            "kalpesh",
            { expiresIn: "1d" }
          );
          res.cookie("token", token);
          return res.json({ status: "Ok", role: user.role });
        } else {
          return res.json("the password is incorrect");
        }
      });
    } else {
      return res.json("No record existed");
    }
  });
});


app.get("/new-user", async (req, res) => {
  try {
    const allPartner = await Partner.find({});
    res.send({status: "ok", data: allPartner});
  } catch (error) {
    console.log(error);
  }
});