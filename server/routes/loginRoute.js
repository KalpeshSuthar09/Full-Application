const express = require("express");
const app = express();
const User = require("../models/userModel");

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
  app.post('/login', (req, res) => {
    const {email, password} = req.body;
    UserModel.findOne({email: email})
    .then(user => {
      if (user) {
        bcrypt.compare(password, user.password, (err, response) => {
          if (response) {
            const token = jwt.sign({email: user.email, role:user.role},
              "kalpesh", {expiresIn: '1d'})
              res.cookie('token', token)
              return res.json({status: "Ok", role: user.role})
          } else {
            return res.json("the password is incorrect")
          }
        })
      }else{
        return res.json("No record existed")
      }
    })
  })
  
  const varifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
      return res.json("token is missing")
    }else{
      jwt.json(token, "kalpesh", (err, decoded) => {
        if (err) {
          return res.json("Errors with token")
        }else{
          if (decoded.role === "admin") {
            next()
          }else{
            return res.json("not admin")
          }
        }
      })
    }
  }

module.exports = app;
