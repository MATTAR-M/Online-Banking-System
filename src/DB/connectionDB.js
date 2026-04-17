import mongoose from "mongoose";



const checkConnection = async () => {
  await mongoose
    .connect("mongodb://localhost:27017/Banking_System", {
      serverSelectionTimeoutMS: 5000,
    })
    .then(() => {
      console.log("DB connection has been established🫡 🫡");
    })
    .catch((error) => {
      console.log("Failed to connect to DB🤷‍♂️  🤷‍♂️", error);
    });
};
export default checkConnection;
