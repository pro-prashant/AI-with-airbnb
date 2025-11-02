
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export function getUserIdfromToken() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("Token not found");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id || decoded._id;
  } catch (err) {
    throw new Error("Invalid token");
  }
}
