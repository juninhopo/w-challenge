import { User } from "../../models/User";

const createUser = async (userData: any) => {
  try {
    const newUser = await User.create({
      name: userData.name,
      email: userData.email,
    });

    return {
      message: `User created with ID: ${newUser._id}`,
      newUser: newUser,
    }

  } catch (error) {
    throw new Error(`Error creating user: ${error}`);
  }
}

export default createUser
