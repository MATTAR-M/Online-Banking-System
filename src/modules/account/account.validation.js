import joi from "joi";

export const accountSchema = {
    body: joi.object({
        currency: joi.string().valid('EGP', 'USD', 'EUR', 'SAR').optional(),
        
    }).required().messages({
        "any.required":"body must not be empty"
    })
};
export const getAccountStatement = {
    query: joi.object({
        startDate: joi.date().iso().required(),
        endDate: joi.date().iso().greater(joi.ref("startDate")).required()
    }).required()
}