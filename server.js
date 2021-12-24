const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const indexRouter = require("./routes/index");
const categoryRouter = require("./routes/category");
const productRouter = require("./routes/product");
const cartRouter = require("./routes/cart");
const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");
const mongose = require("mongoose");

const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");
require("./models/passport.model")(passport);
const app = express();
require("dotenv").config();

app.use(flash());
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layouts/layout");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false, limit: "10mb" }));

const connectFunction = async () => {
  try {
    await mongose.connect(process.env.STR_CONNECT, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log("connected succesfully");
  } catch (e) {
    console.log(e);
    console.log("connection failed");
  }
};

connectFunction();
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 },
  })
);
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.use("/", indexRouter);
app.use("/category", categoryRouter);
app.use("/product", productRouter);
app.use("/cart", cartRouter);
app.use("/user", userRouter);
app.use("/admin", adminRouter);

app.listen(process.env.PORT || 3000);
