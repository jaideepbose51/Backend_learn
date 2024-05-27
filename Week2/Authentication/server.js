import express from "express";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import morgan from "morgan";
import session from "express-session";
import passport from "passport";
import bodyParser from "body-parser";
import { Strategy as LocalStrategy } from "passport-local";
import env from "dotenv";

const app = express();
env.config();
const port = process.env.PORT;
const saltRounds = process.env.SALT_ROUNDS;

mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const UserModel = mongoose.model("User", userSchema);

app.use(express.json());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "TOPSECRET",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 365,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).send({ msg: "User Authenticated Successfully" });
  } else {
    res.status(400).send({ msg: "login first" });
  }
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/secrets",
    failureRedirect: "/login",
  })
);

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await UserModel.findOne({ username });

    if (existingUser) {
      res.redirect("/login");
    } else {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const newUser = new UserModel({ username, password: hashedPassword });
      await newUser.save();

      req.login(newUser, (err) => {
        if (err) {
          console.error("Login error:", err);
          return res.redirect("/signup");
        }
        res.redirect("/");
      });
    }
  } catch (err) {
    console.error(err);
    res.redirect("/signup");
  }
});

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await UserModel.findOne({ username });
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Incorrect password." });
      }
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.listen(port, (err) => {
  if (err) throw err;
  console.log(`Server is running on port ${port}`);
});
