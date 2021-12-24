const express = require("express");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const passport = require("passport");
const router = express.Router();

router.get("/", async (req, res) => {
  const users = await userModel.find();
  res.render("users/index", { users: users });
});
router.get("/register", (req, res) => {
  res.render("users/register");
});

function check(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/user/login");
}
// LOGIN
router.get("/login", (req, res) => {
  res.render("users/login");
});
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/user/login",
    failureFlash: true,
  })
);
router.get("/profile", check, (req, res) => {
  let name = "No name";
  if (req.user) {
    id = req.user._id;
    name = req.user.name;
    email = req.user.email;
    address = req.user.address;
    phone = req.user.phone;
  }
  // console.log(value)
  res.render("users/profile", { name: name });
});

router.post("/", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const users = new userModel({
      name: req.body.name,
      old: req.body.old,
      address: req.body.address,
      phone: req.body.phone,
      email: req.body.email,
      level: req.body.level,
      password: hashedPassword,
    });
    await users.save();
    req.flash("success", "Insert succesfull");
    res.redirect("/user/login");
  } catch (e) {
    req.flash("error", "Insert failed");
    console.log(e);
    res.redirect("/");
  }
});

router.get("/logout", (req, res) => {
  req.logout();
  console.log("Logout successful");
  res.redirect("/user/login");
});

router.get("/edit/:id", check, async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    res.render("users/profile", { user: user });
  } catch (e) {
    console.log(e);
    res.redirect("/");
  }
});
router.put("/edit/:id", async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    user.name = req.body.name;
    user.address = req.body.address;
    user.phone = req.body.phone;
    user.email = req.body.email;
    await user.save();
    res.redirect("/user/profile");
  } catch (e) {
    console.log(e);
    res.redirect("/");
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const user = await userModel.findByIdAndDelete(req.params.id);
    res.redirect("/user");
  } catch (e) {
    console.log(e);
    res.redirect("/");
  }
});

router.get("/github", passport.authenticate("github"));
router.get(
  "/github/callback",
  passport.authenticate("github", {
    successRedirect: "/user/profile",
    failureRedirect: "/user/login",
    failureFlash: true,
  })
);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/user/profile",
    failureRedirect: "/user/login",
    failureFlash: true,
  })
);
module.exports = router;
