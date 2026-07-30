import bcrypt from "bcryptjs";

export async function hashPassword(password) {
  const hashPassword = await bcrypt.hash(password, 10);
  return hashPassword
}

export async function verifyPassword(password, hashPassword) {
  return await bcrypt.compare(password, hashPassword);
}