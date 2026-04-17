import mongoose from "mongoose";
import { RoleEnum } from "../../common/enum/Role.enum.js";

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  fullName: {
    type: String,
    required: true,
  },
    email: {
        type: String,
        required: true,
        unique: true,
    },  
    password: {
        type: String,
        required: true,
        minLength:8,
        trim:true
    },
    Role:{
        type : String,
        enum: Object.values(RoleEnum),
        default : RoleEnum.user 
    }
},{
    timestamps: true,
    strictQuery: true
});

// userSchema.virtual("userName")
// .get(function (){
//     return this.firstName+" "+this.lastName
// })
// .set(function(v){
//     const [firstName,lastName] = v.split(" ")
//     this.set({firstName,lastName})
// })

const userModel = mongoose.models.user||mongoose.model("User", userSchema);

export default userModel;   