import * as DBS from "../../DB/db.service.js";
import bankAccountModel from "../../DB/models/bankAccount.model.js";
import { successResponse } from "../../common/util/response.succ.js";
import {
  decrypt,
  encrypt,
} from "../../common/util/security/encrypt.security.js";
import { Compare, Hash } from "../../common/util/security/hash.secruity.js";
import { v4 as uuidv4 } from "uuid";
import { generateToken, verifyToken } from "../../common/util/token.serivce.js";
import { SECRET_KEY,Refresh_SECRET_KEY } from "../../../config/config.service.js";
import { randomUUID } from "crypto";
import { getValue, setValue } from "../../DB/redis/redis.service.js";
import transactionModel from "../../DB/models/transaction.model.js";



export const createAccount = async(req,res,next)=>{
    const currency = req.body.currency || "EGP"
    const account = await DBS.findone({model:bankAccountModel,filter:{userId:req.user._id}})
    if(account){
        throw new Error("user already has an account",{cause:402})
    }
    const generateAccountNumber = () =>  Math.floor(1000000000 + Math.random() * 9000000000).toString()
    let newAccountNumber = generateAccountNumber();
    let isNotUnique = await DBS.findone({model:bankAccountModel,filter:{accountNumber:newAccountNumber}})
    while(isNotUnique){
        newAccountNumber = generateAccountNumber();
        isNotUnique = await DBS.findone({model:bankAccountModel,filter:{accountNumber:newAccountNumber}})
    }


const newAccount = await DBS.create({
    model:bankAccountModel,
    data:{
        id:uuidv4(),
        userId:req.user._id,
        accountNumber:newAccountNumber,
        balanceCurrently:0,
        currency
    }

})
successResponse({res,status:201,data:{newAccount}})
}


export const getAccount = async(req,res,next)=>{
    const account = await DBS.findone({model:bankAccountModel,filter:{userId:req.user._id}})
    if(!account){
        throw new Error("account not found",{cause:404})
    }
    successResponse({res,status:200,data:{account}})

}

export const getAccountStatement = async(req,res,next)=>{

    const {startDate,endDate} = req.query
    const account = await DBS.findone({model:bankAccountModel,filter:{userId:req.user._id}})
    if(!account){
        throw new Error("You don't have a account, please create a account first",{cause:404})
    }   
    const filter = { accountId: account._id, createdAt: {
        $gte: startDate ? new Date(startDate) : new Date(0), 
        $lte: endDate ? new Date(endDate) : new Date()
    } };
    const transactions = await DBS.find({
        model:transactionModel,
        filter,
        options:{
            select:"type amount balanceBefore balanceAfter createdAt",
            sort:{createdAt:-1}
        }
    })
    successResponse({
        res,
        status: 200,
        message: "Account status fetched successfully",
        data: {
            balanceCurrently:account.balanceCurrently,
            transactions
        }
    });
}
