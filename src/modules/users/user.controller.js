import { Router } from "express";
import * as US from "./user.service.js";
import { Validation } from "../../common/middleware/validators.js";
import * as UV from "./user.validation.js";
import { RoleEnum } from "../../common/enum/Role.enum.js";
import { authentication } from "../../common/middleware/authentication.js";
import { authorization } from "../../common/middleware/authorization.js";

const userRouter = Router();

userRouter.post("/auth/register/", US.createUser);
userRouter.post("/auth/login/", Validation(UV.signInSchema), US.login);

export default userRouter;
