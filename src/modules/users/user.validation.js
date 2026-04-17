import joi from "joi";
import { generalRules } from "../../common/util/generalRules.js";

export const signUpSchema = {
    body: joi
      .object({
        userName: joi.string().min(10).max(40).required(),
        email: generalRules.email.required(),
        password: generalRules.password.required(),
        cpassword: generalRules.cpassword.required(),
      })
      .required()
      .with("password", "cpassword")
      .messages({
        "any.required": "body must not be empty",
      })
    }
    export const    signInSchema = {
        body: joi
          .object({
            email: generalRules.email.required(),
            password: generalRules.password.required(),
          })
          .required(),
    }