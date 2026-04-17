import mongoose from "mongoose"
import { statusenum } from "../../common/enum/account.enum.js"

const bankAccountSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    accountNumber:{
        type: String,
        required: true,
        unique: true
    },  
    balanceCurrently:{
        type: Number,
        required: true,
        default:0
    },
    status:{
        type: String,
        status:Object.values(statusenum),
        default:statusenum.active 
    },
    Currency:{
        type: String,
        required: true,
        default:"EGP"
    }
},{
    timestamps: true,
    strictQuery: true 
})


const bankAccountModel = mongoose.models.bankAccount||mongoose.model("bankAccountModel", bankAccountSchema)

export default bankAccountModel