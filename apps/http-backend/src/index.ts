import express from "express";
import jwt from "jsonwebtoken";

import { middleware } from "./middleware";
import { JWT_SECRET } from "@repo/backend-utils/config";
import { CreateRoomSchema, CreateUserSchema, SignInSchema } from "@repo/common-utils/types";

const app = express();
const PORT = 3001;
app.use(express.json());

app.post("/signup", (req, res) => {
    const parsedData = CreateUserSchema.safeParse(req.body);
    if(!parsedData.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }

    const { username, password } = parsedData.data;

    // db call

    res.json({
        userId: 123
    })
})

app.post("/signin", (req, res) => {
    const parsedData = SignInSchema.safeParse(req.body);
    if(!parsedData.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }
    const { username, password } = parsedData.data;

    const userId = 1;
    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    res.json({
        token
    })
})

app.post("/create-room", middleware, (req, res) => {
    const parsedData = CreateRoomSchema.safeParse(req.body);
    if(!parsedData.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }
    // const userId = req.userId;

    // Create a new room for Admin = userId
    const room = 1;
    
    res.json({
        room
    })
})

app.listen(PORT, () => {
    console.log(`Server is listening at port ${PORT}`);
})