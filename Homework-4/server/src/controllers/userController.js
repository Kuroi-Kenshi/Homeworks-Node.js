import { User } from "../models/User.js";

export const getUser = async (req, res) => {
  try {
    const users = await User.find();

    const userDto = users.map(user => ({
      id: user._id,
      username: user.username
    }))
    
    return res.json({ users: userDto })
  } catch (error) {
    res.status(500).json({ message: 'Произошла непредвиденная ошибка' })
  }
};