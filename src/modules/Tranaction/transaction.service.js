import * as DBS from "../../DB/db.service.js";
import transactionModel from "../../DB/models/transaction.model.js";
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
import bankAccountModel from "../../DB/models/bankAccount.model.js";
import { TransactionEnum, TransactionTypeEnum } from "../../common/enum/transaction.enum.js";
import { statusenum } from "../../common/enum/account.enum.js";


export const getTransaction = async(req,res,next)=>{
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10; 
    const skip = (page - 1) * limit;
    const account = await DBS.findone({model:bankAccountModel,filter:{userId:req.user._id}})
    if(!account){
        throw new Error("You don't have a account, please create a account first",{cause:404})
    }   

    const transactions = await transactionModel.find({accountId:account._id})
    .sort({createdAt:-1})
    .skip(skip)
    .limit(limit)
    const totalTransactions = await transactionModel.countDocuments({ accountId: account._id });
    const totalPages = Math.ceil(totalTransactions / limit);
    return successResponse({
        res,
        status: 200,
        message: "Transactions fetched successfully",
        data: {
            transactions,
            paginationInfo: {
                currentPage: page,
                limit: limit,
                totalTransactions,
                totalPages
            }
        }
    });
}

export const getTransactionById = async(req,res,next)=>{
    const {id} = req.params
    const account = await DBS.findone({model:bankAccountModel,filter:{userId:req.user._id}})
    if(!account){
        throw new Error("You don't have a account, please create a account first",{cause:404})
    }
    const transaction = await DBS.findone({model:transactionModel,filter:{_id:id,accountId:account._id}})  
    if(!transaction){
        throw new Error("Transaction not found",{cause:404})
    }   
    const {_id,type,accountId,amount,balanceBefore,balanceAfter,status,createdAt}=transaction
    successResponse({
        res,
        status: 200,
        message: "Transaction fetched successfully",
        data: {
            transaction:{_id,type,accountId,amount,balanceBefore,balanceAfter,status,createdAt}
        }
    }); 
}

export const depo = async(req,res,next)=>{
    const amount = Number(req.body.amount);
    if (amount <= 0 || isNaN(amount)) {
        throw new Error("Amount must be a valid positive number", { cause: 400 });
    }
    const account = await DBS.findone({model:bankAccountModel,filter:{userId:req.user._id}})
    if(!account){
        throw new Error("You don't have a account, please create a account first",{cause:404})
    }
    if(account.status !== "active"){
        throw new Error("Your account is not active, please contact support",{cause:403})
    }
    const balancePre = Number(account.balanceCurrently)
    const balancePost = Number(account.balanceCurrently) + Number(amount)
    await DBS.findAndupdateOne({model:bankAccountModel,filter:{_id:account._id},update:{balanceCurrently:balancePost}})
    
    const Transaction = await DBS.create({
        model:transactionModel,
        data:{
            id:uuidv4(),
            accountId:account._id,
            type:TransactionTypeEnum.deposit,
            status:TransactionEnum.completed,
            amount:amount,
            balanceBefore:balancePre,
            balanceAfter:balancePost,
        }
    })
successResponse({
    res,
    status: 200,
    message: "Deposit successful",
    data: {
        Transaction
    }
})

}

export const widraw = async(req,res,next)=>{
    const amount = Number(req.body.amount);
    if (amount <= 0 || isNaN(amount)) {
        throw new Error("Amount must be a valid positive number", { cause: 400 });
    }
    const account = await DBS.findone({model:bankAccountModel,filter:{userId:req.user._id}})
    if(!account){
        throw new Error("You don't have a account, please create a account first",{cause:404})
    }
    if(account.status !== "active"){
        throw new Error("Your account is not active, please contact support",{cause:403})
    }
    if(account.balanceCurrently < amount){
        throw new Error("Insufficient balance", { cause: 400 });
    }
    const balancePre = Number(account.balanceCurrently)
    const balancePost = Number(account.balanceCurrently) - Number(amount)
    await DBS.findAndupdateOne({model:bankAccountModel,filter:{_id:account._id},update:{balanceCurrently:balancePost}})
    
    const Transaction = await DBS.create({
        model:transactionModel,
        data:{
            id:uuidv4(),
            accountId:account._id,
            type:TransactionTypeEnum.withdrawal,
            status:TransactionEnum.completed,
            amount:amount,
            balanceBefore:balancePre,
            balanceAfter:balancePost,
        }
    })
successResponse({
    res,
    status: 200,
    message: "Widraw successful",
    data: {
        Transaction
    }
})
}


export const transfer = async(req,res,next)=>{
    const amount = Number(req.body.amount);
    const {accountNumber,description} = req.body
    if (amount <= 0 || isNaN(amount)) {
        throw new Error("Amount must be a valid positive number", { cause: 400 });
    }
    const senderAccount = await DBS.findone({model:bankAccountModel,filter:{userId:req.user._id}})
    if (senderAccount.accountNumber === accountNumber) {
        throw new Error("You cannot transfer money to your own account", { cause: 400 });
    }
    if(!senderAccount){
        throw new Error("You don't have a account, please create a account first",{cause:404})
    }
    if(senderAccount.status !== "active"){
        throw new Error("Your account is not active, please contact support",{cause:403})
    } 
    if(senderAccount.balanceCurrently < amount){
        throw new Error("Insufficient balance", { cause: 400 });
    }
    const senderBalancePre = Number(senderAccount.balanceCurrently)
    const senderBalancePost = Number(senderAccount.balanceCurrently) - Number(amount)
    const recepiantAccount = await DBS.findone({model:bankAccountModel,filter:{accountNumber}})
    if(!recepiantAccount){
        throw new Error("Recepiant account not found",{cause:404})
    }
    if(recepiantAccount.status !== "active"){
        throw new Error("Recepiant account is not active, please contact support",{cause:403})
    }   
    const recepiantBalancePre = Number(recepiantAccount.balanceCurrently)
    const recepiantBalancePost = Number(recepiantAccount.balanceCurrently) + Number(amount)
    await DBS.findAndupdateOne({model:bankAccountModel,filter:{_id:senderAccount._id},update:{balanceCurrently:senderBalancePost}})
    await DBS.findAndupdateOne({model:bankAccountModel,filter:{_id:recepiantAccount._id},update:{balanceCurrently:recepiantBalancePost}})
    await DBS.create({
        model:transactionModel,
        data:{
            id:uuidv4(),
            accountId:senderAccount._id,
            type:TransactionTypeEnum.transfer,
            status:TransactionEnum.completed,
            amount:amount,
            balanceBefore:senderBalancePre,
            balanceAfter:senderBalancePost,
            description:description || `Transfer to account ${accountNumber}`
        }
    })
    await DBS.create({
        model:transactionModel,
        data:{
            id:uuidv4(),
            accountId:recepiantAccount._id,
            type:TransactionTypeEnum.transfer,
            status:TransactionEnum.completed,
            amount:amount,
            balanceBefore:recepiantBalancePre,
            balanceAfter:recepiantBalancePost,
            description:description || `Transfer from account ${senderAccount.accountNumber}`
        }
    })
successResponse({res,status:200,message:"Transfer successful"})
}


export const TransactionSummery = async(req,res,next)=>{
    const account = await DBS.findone({model:bankAccountModel,filter:{userId:req.user._id}})
    if(!account){
        throw new Error("You don't have a account, please create a account first",{cause:404})
    }   
    const transactions = await DBS.find({
        model: transactionModel,
        filter: { accountId: account._id },
        options: {
            select: "type amount balanceBefore balanceAfter createdAt",
            sort: { createdAt: -1 }
        }
    })
    successResponse({
        res,
        status: 200,
        message: "Transaction summery fetched successfully",
        data: {
            balanceCurrently:account.balanceCurrently,
            totalCount: transactions.length,
            transactions
        }
    });
}


export const updateAccountStatus = async(req,res,next)=>{
    const{accountNumber,statusUpdate} = req.body
    const account = await DBS.findone({model:bankAccountModel,filter:{accountNumber}})
    // const adminAccountNumber = await DBS.findone({model:bankAccountModel,filter:{userId:req.user._id}})
    const validStatuses = Object.values(statusenum); 
    if (!validStatuses.includes(statusUpdate)) {
        throw new Error("Invalid status. Please send 'active' or 'inactive'", { cause: 400 });
    }
    if(!account){
        throw new Error("Account not found",{cause:404})
    }
    if (account.status === statusUpdate) {
        throw new Error(`The account is already ${statusUpdate}`, { cause: 400 });
    }
    // يعني الادمن مش هيبقي قادر يغير حاله حسابه ليه ؟؟ بس هسيبها عشان كانت تفكير اللوجيك حلو تتحسب بوينت ليا
    // if(accountNumber === adminAccountNumber.accountNumber){
    //     throw new Error("You cannot update the status of your own account", { cause: 400 });
    // }
    const updatedAccount = await DBS.findAndupdateOne({
        model: bankAccountModel,
        filter: { _id: account._id },
        update: { status: statusUpdate }
    });
    if (!updatedAccount) {
        throw new Error("Failed to update account status", { cause: 500 });
    }
successResponse({
        res,
        status: 200,
        message: `Account status updated to ${statusUpdate} successfully`
    });

}



