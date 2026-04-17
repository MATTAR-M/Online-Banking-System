import mongoose from "mongoose"

const beneficiarySchema = new mongoose.Schema({
    id:{
        type: String,
        required: true,
        unique: true
    },
    ownerUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    accountNumber:{
        type: Number,
        required: true,
    },
    bankName:{
        type: String,
        required: true,
    },  
    nickName:{
        type: String,
    }
})



const beneficiaryModel = mongoose.models.beneficiary||mongoose.model("beneficiaryModel", beneficiarySchema) 

export default beneficiaryModel