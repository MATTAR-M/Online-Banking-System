import * as DBS from "../../DB/db.service.js";
import userModel from "../../DB/models/user.model.js";
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

export const createUser = async (req, res, next) => {
  const { fullName, email, password } = req.body;

  if (await DBS.findone({ model: userModel, filter: { email } })) {
    throw new Error("email already exist", { cause: 402 });
  }

  const user = await DBS.create({
    model: userModel,
    data: {
      id: uuidv4(),
      fullName,
      email,
      password: Hash({ plainText: password }, { salt_rounds: 11 }),
    },
  });
  const accessToken = generateToken({
    payload: { id: user._id, email: user.email },
    secritKey: SECRET_KEY,
    options: {
      expiresIn: "1h",
      jwtid: uuidv4(),
    },
  });
  successResponse({ res, status: 201, data: {user:{fullName,email}, accessToken} });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await DBS.findone({ model: userModel, filter: { email } });
  if (!user) {
    throw new Error("user does not exist", { cause: 402 });
  }
  if (!Compare({ plainText: password, cipherText: user.password })) {
    throw new Error("inValid password", { cause: 402 });
  }
  const jwtid = randomUUID();
  const accessToken = generateToken({
    payload: { id: user._id, email: user.email },
    secritKey: SECRET_KEY,
    options: {
      expiresIn: "1h",
      issuer: "Matar",
      jwtid,
    },
  });
  const refreshToken = generateToken({
    payload: { id: user._id, email: user.email },
    secritKey: Refresh_SECRET_KEY,
    options: {
      expiresIn: "7d",
      jwtid,
    },
  });
  successResponse({
    res,
    message: "Successful sign in",
    data: { accessToken, refreshToken },
  });
};

