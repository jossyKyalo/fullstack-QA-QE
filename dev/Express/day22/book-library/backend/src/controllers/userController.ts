import { Request, Response } from "express";
import bcrypt from "bcrypt";
import pool from "../db/db.config";
import asyncHandler from "../middlewares/asyncHandler";


const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role_id } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    "INSERT INTO users (name, email, password, role_id) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, email, hashedPassword, role_id]
  );

  res.status(201).json({ message: "User registered successfully", user: result.rows[0] });
});


const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  if (result.rowCount === 0) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const user = result.rows[0];
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({ message: "Login successful", user: { id: user.user_id, name: user.name, email: user.email } });
});


const getAllUsers = asyncHandler(async (_req: Request, res: Response) => {
  const result = await pool.query("SELECT user_id, name, email, role_id FROM users");
  res.json(result.rows);
});


const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await pool.query("SELECT user_id, name, email, role_id FROM users WHERE user_id = $1", [id]);

  if (result.rowCount === 0) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(result.rows[0]);
});

 
const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, role_id } = req.body;

  const result = await pool.query(
    "UPDATE users SET name = $1, email = $2, role_id = $3 WHERE user_id = $4 RETURNING *",
    [name, email, role_id, id]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ message: "User updated successfully", user: result.rows[0] });
});

 
const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await pool.query("DELETE FROM users WHERE user_id = $1 RETURNING *", [id]);

  if (result.rowCount === 0) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ message: `User ${id} deleted successfully` });
});

export { registerUser, loginUser, getAllUsers, getUserById, updateUser, deleteUser };
