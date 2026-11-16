import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function createToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email };
}

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 60) {
      return res.status(400).json({ message: "Name must be between 2 and 60 characters." });
    }
    if (typeof email !== "string" || email.length > 254 || !emailPattern.test(email)) {
      return res.status(400).json({ message: "Enter a valid email address." });
    }
    if (typeof password !== "string" || password.length < 10 || password.length > 128) {
      return res.status(400).json({ message: "Password must be between 10 and 128 characters." });
    }
    const normalizedEmail = email.trim().toLowerCase();
    if (await User.exists({ email: normalizedEmail })) {
      return res.status(409).json({ message: "An account with that email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name: name.trim(), email: normalizedEmail, passwordHash });
    res.status(201).json({ token: createToken(user._id.toString()), user: publicUser(user) });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (typeof email !== "string" || !emailPattern.test(email) || typeof password !== "string" || !password) {
      return res.status(400).json({ message: "Enter a valid email address and password." });
    }
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+passwordHash");
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: "Email or password is incorrect." });
    }
    res.json({ token: createToken(user._id.toString()), user: publicUser(user) });
  } catch (error) {
    next(error);
  }
}

export async function getUser(req, res, next) {
  try {
    if (req.params.id !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only view your own account." });
    }
    res.json({ user: publicUser(req.user) });
  } catch (error) {
    next(error);
  }
}
