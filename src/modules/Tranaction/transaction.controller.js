import { Router } from "express";
import * as TS from "./transaction.service.js";
import { Validation } from "../../common/middleware/validators.js";
import * as TV from "./transaction.validation.js";
import { RoleEnum } from "../../common/enum/Role.enum.js";
import { authentication } from "../../common/middleware/authentication.js";
import { authorization } from "../../common/middleware/authorization.js";

const transactionRouter = Router(); 
transactionRouter.get(
    "/my", 
    authentication, 
    authorization([RoleEnum.user]), 
    Validation(TV.getMyTransactionsSchema), 
    TS.getTransaction);
transactionRouter.get("/:id", authentication, authorization([RoleEnum.user,RoleEnum.admin]), Validation(TV.getTransactionByIdSchema), TS.getTransactionById);
transactionRouter.post("/deposit", authentication, authorization([RoleEnum.user,RoleEnum.admin]), Validation(TV.depositSchema), TS.depo);
transactionRouter.post("/withdraw", authentication, authorization([RoleEnum.user,RoleEnum.admin]), Validation(TV.withdrawSchema), TS.widraw);
transactionRouter.post("/transfer", authentication, authorization([RoleEnum.user,RoleEnum.admin]), Validation(TV.transferSchema), TS.transfer);
transactionRouter.get("/my/summary", authentication, authorization([RoleEnum.user,RoleEnum.admin]) ,TS.TransactionSummery);
transactionRouter.patch("/admin/update-account-status", authentication, authorization([RoleEnum.admin]), Validation(TV.updateAccountStatusSchema), TS.updateAccountStatus);
export default transactionRouter;