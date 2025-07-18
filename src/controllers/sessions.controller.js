import jwt from "jsonwebtoken";
import { usersService } from "../services/index.js";
import { createHash, passwordValidation } from "../utils/index.js";
import UserDTO from "../dto/User.dto.js";
import config from "../config/config.js";

const SECRET = config.JWT_SECRET_KEY;
const ALGORITHM = "HS256";

// FIX: Función generateToken corregida para firmar (sign) un token.
const generateToken = (payload, expiresIn = "1h") => {
  try {
    return jwt.sign(payload, SECRET, {
      algorithm: ALGORITHM,
      expiresIn,
    });
  } catch (error) {
    // En caso de error, es mejor lanzar la excepción o loguearla.
    console.error("Error al generar el token:", error);
    return null;
  }
};

// FIX: Función verifyToken creada para verificar un token.
const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET, {
      algorithms: [ALGORITHM],
    });
  } catch (error) {
    console.error("Error al verificar el token:", error.message);
    return null;
  }
};


const register = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    if (!first_name || !last_name || !email || !password) {
      return res
        .status(400)
        .send({ status: "error", error: "Incomplete values" });
    }

    const exists = await usersService.getUserByEmail(email);
    if (exists) {
      return res
        .status(400)
        .send({ status: "error", error: "User already exists" });
    }

    const hashedPassword = await createHash(password);
    const user = { first_name, last_name, email, password: hashedPassword };
    const result = await usersService.create(user);

    res.send({ status: "success", payload: result._id });
  } catch (error) {
    res.status(500).send({ status: "error", message: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .send({ status: "error", error: "Incomplete values" });
    }

    const user = await usersService.getUserByEmail(email);
    if (!user) {
      return res
        .status(404)
        .send({ status: "error", error: "User doesn't exist" });
    }

    const isValidPassword = await passwordValidation(user, password);
    if (!isValidPassword) {
      return res
        .status(400)
        .send({ status: "error", error: "Incorrect password" });
    }

    const userDto = UserDTO.getUserTokenFrom(user);
    const token = generateToken(userDto); 
    if (!token) {
        return res.status(500).send({ status: "error", message: "Could not generate token" });
    }

    res.cookie("coderCookie", token, { maxAge: 3600000 }).send({
      status: "success",
      message: "Logged in",
    });
  } catch (error) {
    res.status(500).send({ status: "error", message: "Internal server error" });
  }
};

const current = async (req, res) => {
  try {
    const cookie = req.cookies["coderCookie"];
    if (!cookie) {
        return res.status(401).send({ status: "error", message: "No token provided"});
    }
    const user = verifyToken(cookie); 
    if (!user) {
      return res
        .status(401)
        .send({ status: "error", message: "Invalid or expired token" });
    }
    res.send({ status: "success", payload: user });
  } catch (error) {
    res.status(500).send({ status: "error", message: "Internal server error" });
  }
};

const unprotectedLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .send({ status: "error", error: "Incomplete values" });
    }

    const user = await usersService.getUserByEmail(email);
    if (!user) {
      return res
        .status(404)
        .send({ status: "error", error: "User doesn't exist" });
    }

    const isValidPassword = await passwordValidation(user, password);
    if (!isValidPassword) {
      return res
        .status(400)
        .send({ status: "error", error: "Incorrect password" });
    }

    // Se genera un token a partir del objeto de usuario completo para esta ruta.
    const token = generateToken(user.toObject()); 
     if (!token) {
        return res.status(500).send({ status: "error", message: "Could not generate token" });
    }
    res.cookie("unprotectedCookie", token, { maxAge: 3600000 }).send({
      status: "success",
      message: "Unprotected Logged in",
    });
  } catch (error) {
    res.status(500).send({ status: "error", message: "Internal server error" });
  }
};

const unprotectedCurrent = async (req, res) => {
  try {
    const cookie = req.cookies["unprotectedCookie"];
     if (!cookie) {
        return res.status(401).send({ status: "error", message: "No token provided"});
    }
    const user = verifyToken(cookie);
    if (!user) {
      return res
        .status(401)
        .send({ status: "error", message: "Invalid or expired token" });
    }
    res.send({ status: "success", payload: user });
  } catch (error) {
    res.status(500).send({ status: "error", message: "Internal server error" });
  }
};

export default {
  register,
  login,
  current,
  unprotectedLogin,
  unprotectedCurrent,
};