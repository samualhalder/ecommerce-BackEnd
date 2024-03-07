const express = require("express");
const server = express();
const mongoose = require("mongoose");
const cors = require("cors");

const { createProduct } = require("./controller/Product");
const productsRouter = require("./routes/Products");
const categoriesRouter = require("./routes/Categories");
const brandsRouter = require("./routes/Brands");
const usersRouter = require("./routes/Users");
const authRouter = require("./routes/Auth");
const cartRouter = require("./routes/Cart");
const ordersRouter = require("./routes/Order");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { User } = require("./model/User");
const crypto = require("crypto");
const { isArgumentsObject } = require("util/types");
const { isAuth, sanetizeUser } = require("./services/common");
const jwt = require("jsonwebtoken");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const SECRET_KEY = "SECRET_KEY";

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = SECRET_KEY;

//middlewares
server.use(
  session({
    secret: "keyboard cat",
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something store
  })
);
server.use(passport.authenticate("session"));

server.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);
server.use(express.json()); // to parse req.body
server.use("/products", isAuth(), productsRouter.router);
server.use("/categories", isAuth(), categoriesRouter.router);
server.use("/brands", isAuth(), brandsRouter.router);
server.use("/users", isAuth(), usersRouter.router);
server.use("/auth", authRouter.router);
server.use("/cart", isAuth(), cartRouter.router);
server.use("/orders", isAuth(), ordersRouter.router);

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/ecommerce");
  console.log("database connected");
}

server.get("/", (req, res) => {
  res.json({ status: "success" });
});

server.listen(8080, () => {
  console.log("server started");
});

//passport strategy
passport.use(
  "local",
  new LocalStrategy({ usernameField: "email" }, async function (
    email,
    password,
    done
  ) {
    try {
      const user = await User.findOne({ email: email }).exec();

      if (!user) {
        return done(null, false, { message: "No such user with this email" });
      }
      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        "sha256",
        async function (err, hashedPassword) {
          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            return done(null, false, { message: "Invalid credentials" });
          }
          const token = jwt.sign(sanetizeUser(user), SECRET_KEY);
          done(null, token);
        }
      );
    } catch (err) {
      done(err);
    }
  })
);

passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = await User.findOne({ id: jwt_payload.sub });
      if (user) {
        return done(null, sanetizeUser(user));
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(err, false);
    }
  })
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, { id: user.id, role: user.role });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});
