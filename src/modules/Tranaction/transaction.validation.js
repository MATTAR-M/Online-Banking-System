import joi from "joi";
import { statusenum } from "../../common/enum/account.enum.js";

export const getMyTransactionsSchema = {
    query: joi.object({
        page: joi.number().integer().min(1).optional(),
        limit: joi.number().integer().min(1).max(50).optional() 
    }).required()
};



export const getTransactionByIdSchema = {
    params: joi.object({
        id: joi.string().hex().length(24).required()
    }).required()
}


export const depositSchema = {
    body: joi.object({
        amount: joi.number().positive().required(),
        description: joi.string().max(255).optional()
    }).required()
}


export const withdrawSchema = {
    body: joi.object({
        amount: joi.number().positive().required(),
        description: joi.string().max(255).optional()
    })
}

export const transferSchema = {
    body: joi.object({
        amount: joi.number().positive().required(),
        accountNumber: joi.string().required(),
        description: joi.string().max(255).optional()
    }).required()
}



