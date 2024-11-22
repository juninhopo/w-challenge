import jwt from 'jsonwebtoken';
import { config } from './config';
import { IUser, UserModel } from './modules/user/UserModel';

export const getUser = async (token: string | null | undefined) => {
  if (!token) return { user: null };

  try {
    const decodedToken = jwt.verify(token.substring(10), config.SECRET_KEY_JWT);

    const user = await UserModel.findOne({ _id: (decodedToken as { id: string }).id });

    return {
      user,
    };
  } catch (err) {
    return { user: null };
  }
};

export const generateToken = (user: IUser) => {
  return `JWT ${jwt.sign({ id: user._id }, config.SECRET_KEY_JWT)}`;
};
