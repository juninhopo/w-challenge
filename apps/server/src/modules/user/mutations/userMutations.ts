import { UserLoginMutation } from "./LoginMutation";
import { CreateUserMutation } from "./UserAddMutation";

export const userMutations = {
	CreateUser: CreateUserMutation,
	LoginUser: UserLoginMutation,
};
