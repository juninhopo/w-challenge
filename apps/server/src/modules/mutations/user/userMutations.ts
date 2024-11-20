import { LoginUserMutation } from "./login/LoginMutation";
import { CreateUserMutation } from "./create/CreateMutation";

export const userMutations = {
	CreateUser: CreateUserMutation,
	LoginUser: LoginUserMutation,
};
