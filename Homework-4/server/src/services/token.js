import { Token } from "../models/Token.js";
import jwt from 'jsonwebtoken';

export const generateAccessToken = (id, roles) => {
  const payload = { id, roles };

  const accessToken = jwt.sign(payload, process.env.SECRET_ACCESS_TOKEN, { expiresIn: "30m" })
  const refreshToken = jwt.sign(payload, process.env.SECRET_REFRESH_TOKEN, { expiresIn: "30d" })

  return { accessToken, refreshToken }
}

export const saveToken = async (userId, refreshToken) => {
  const tokenData = await Token.findOne({ user: userId });

  if (tokenData) {
    tokenData.refreshToken = refreshToken;
    return tokenData.save()
  }

  const token = await Token.create({ user: userId, refreshToken });
  return token;
}

export const removeToken = async (refreshToken) => {
  const tokenData = await Token.deleteOne({ refreshToken });
  return tokenData;
}