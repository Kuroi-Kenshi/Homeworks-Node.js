import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { validationResult } from "express-validator"
import { Role } from "../models/Role.js"
import { Token } from '../models/Token.js'
import { User } from "../models/User.js"
import { generateAccessToken, removeToken, saveToken } from '../services/token.js'


export const registration = async (req, res) => {
  try {
    const validationErrors = validationResult(req);
    if (validationErrors.errors.length) {
      return res.status(400).json({ message: 'Ошибка при регистрации', errors: validationErrors.errors })
    }

    const { username, password, email } = req.body;
    const user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({ message: 'Пользователь с таким именем уже существует' })
    }

    const userRole = await Role.findOne({ value: 'USER' })

    const saltRounds = 7;

    bcrypt.hash(password, saltRounds, async (err, hash) => {
      const newUser = new User({ username, email, password: hash, roles: [userRole.value] });
      const userDto = { 
        id: newUser._id, 
        username: newUser.username,
        courses: newUser.courses,
        roles: newUser.roles
      }

      const tokens = generateAccessToken(newUser._id, newUser.roles)
      await saveToken(newUser._id, tokens.refreshToken)
      await newUser.save();

      const maxAgeRefreshToken = 30 * 24 * 60 * 60 * 1000;
      res.cookie('refreshToken', tokens.refreshToken, { maxAge: maxAgeRefreshToken, httpOnly: true, sameSite: 'none', secure: true })
      return res.json({ message: 'Пользователь успешно зарегистрирован', user: userDto, ...tokens })
    });

  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'Registration error' })
  }
}

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: `Пользователь ${username} не найден` })
    }

    const isPassEquals = await bcrypt.compare(password, user.password);

    if (!isPassEquals) {
      return res.status(400).json({ message: 'Введен неверный логин или пароль' })
    }

    const userDto = { 
      id: user._id, 
      username: user.username,
      courses: user.courses,
      roles: user.roles
    }

    const tokens = generateAccessToken(user._id, user.roles)
    await saveToken(user._id, tokens.refreshToken)

    const maxAgeRefreshToken = 30 * 24 * 60 * 60 * 1000;
    res.cookie('refreshToken', tokens.refreshToken, { maxAge: maxAgeRefreshToken, httpOnly: true })
    res.json({ message: 'Пользователь успешно авторизован', user: userDto, ...tokens })
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Непредвиденная ошибка' })
  }
}

export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies
    const token = removeToken(refreshToken)
    res.clearCookie('refreshToken');
    return res.json({ message: 'Пользователь успешно вышел из системы' })
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'Logout error' })
  }
}

export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.cookies
    const userData = jwt.verify(refreshToken, process.env.SECRET_REFRESH_TOKEN)
    const tokenFromDB = await Token.findOne({ refreshToken })

    if (!userData || !tokenFromDB) {
      throw 'Пользователь не авторизован'
    }

    const user = await User.findById(userData.id);

    const userDto = { 
      id: user._id, 
      username: user.username,
      courses: user.courses,
      roles: user.roles
    }

    const tokens = generateAccessToken(user._id, user.roles);
    await saveToken(user._id, tokens.refreshToken)
    const maxAgeRefreshToken = 30 * 24 * 60 * 60 * 1000;
    res.cookie('refreshToken', tokens.refreshToken, { maxAge: maxAgeRefreshToken, httpOnly: true, sameSite: 'none', secure: true })
    return res.json({ message: 'Refresh token успешно обновлен', user: userDto, ...tokens })
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'Login error' })
  }
}

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users)
  } catch (error) {
    
  }
}

