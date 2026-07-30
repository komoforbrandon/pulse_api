import createError from "http-errors";
import { parse } from "../lib/validate.js";
import { operatorSchema } from "../lib/schemas.js";
import { hashPassword, verifyPassword } from "../lib/password.js";
import { signToken} from "../lib/tokens.js";
import * as operatorModel from "../models/operator.js";

export async function createOperator(req, res) {
  const { email, password } = parse(operatorSchema, req.body, 422);
  try {
    const hashedPassword = await hashPassword(password);
    const operator = await operatorModel.create({
      email,
      password_hash: hashedPassword,
    });
    res.status(201).json({
      id: operator.id,
      email: operator.email,
      created_at: operator.created_at,
      message: "Operator created",
    });
  } catch (err) {
    if (err.message === "duplicate") {
      throw createError(409, "That email already exists");
    }
    throw err;
  }
}

export async function login(req, res) {
  const { email, password } = parse(operatorSchema, req.body, 422);

  const operator = await operatorModel.findByEmail(email);

  if (!operator) {
    throw createError(401, "Invalid email or password");
  }

 const passwordCheck = await verifyPassword(password, operator.password_hash);

 if (!passwordCheck) {
  throw createError(401, "Incorrect email or password");
 }

  res.status(200).json({
    token: signToken(operator),
    operator: {
      id: operator.id,
      email: operator.email,
      created_at: operator.created_at,
    },
    message: "Login successful",
  });
}