import express from "express";
import checkConnection from "./DB/connectionDB.js";
import userRouter from "./modules/users/user.controller.js";
import { redis_Connection } from "./DB/redis/redis.connection.js";
import accountRouter from "./modules/account/account.controller.js";
import transactionRouter from "./modules/Tranaction/transaction.controller.js";
import { PORT } from "../config/config.service.js";
    const port = PORT; 
    const app = express();

    const bootstrap = async ()=>{
        await checkConnection();
        await redis_Connection()
        app.use(express.json());
        app.use('/users',userRouter)
        app.use('/account',accountRouter)
        app.use('/transaction',transactionRouter)
        app.get("/", (req, res,next)=>{
        res.send("Hello World");
    });
        app.use('{/*demo}',(req,res,next)=>{
            throw new Error(`URL ${req.originalUrl} not found`,{cause:404})
        })
        app.use((err, req, res, next) => {
            res.status(err.cause||500).json({message:err.message,stack:err.stack})
        })
        app.listen(port, ()=>{
            console.log("Server is running on port 3000");
        });
    }



    export default bootstrap