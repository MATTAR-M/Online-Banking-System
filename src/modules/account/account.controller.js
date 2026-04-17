import { Router } from "express";
import * as AS from "./account.service.js";
import { Validation } from "../../common/middleware/validators.js";
import * as AV from "./account.validation.js";
import { RoleEnum } from "../../common/enum/Role.enum.js";
import { authentication } from "../../common/middleware/authentication.js";
import { authorization } from "../../common/middleware/authorization.js";

const accountRouter = Router(); 

accountRouter.post("/create-account",authentication,authorization([RoleEnum.user]),Validation(AV.accountSchema),AS.createAccount);
accountRouter.get("/me/",authentication,authorization([RoleEnum.user]),AS.getAccount);
accountRouter.get("/me/statement", authentication, authorization([RoleEnum.user,RoleEnum.admin]),Validation(AV.getAccountStatement) ,AS.getAccountStatement);

export default accountRouter;