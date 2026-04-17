import mongoose from "mongoose";
import { TransactionEnum, TransactionTypeEnum } from "../../common/enum/transaction.enum.js";

const transactionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "bankAccount",
    required: true,
  },
  type: {
    type: String,
    enum:Object.values(TransactionTypeEnum),
    required: true,
  },
    amount: {
        type: Number,
        required: true,
    },  
    balanceBefore: {
      type: Number,
      required: true,
    },
    balanceAfter: {
      type: Number,
      required: true,
    },  
    status: {
      type: String,
      enum:Object.values(TransactionEnum),
      default:TransactionEnum.pending
    }
},
{
    timestamps: true,
    strictQuery: true   
});



const transactionModel = mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);

export default transactionModel;