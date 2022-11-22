import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../../mongodb/models/User.js";
import CustomError from "../../CustomError/CustomError.js";
import type { RegisterData } from "../types/userTypes.js";
import type { MongooseError } from "mongoose";

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password, email } = req.body as RegisterData;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password: hashedPassword,
      email,
    });

    res.status(201).json({ user: { id: newUser._id, username, email } });
  } catch (error: unknown) {
    if ((error as MongooseError).message.includes("duplicate key")) {
      const customError = new CustomError(
        "The user already exists",
        409,
        "The user already exists"
      );
      next(customError);
      return;
    }

    const customError = new CustomError(
      (error as Error).message,
      (error as CustomError).statusCode ?? 500,
      (error as CustomError).publicMessage || "Something went wrong"
    );
    next(customError);
  }
};

export default registerUser;