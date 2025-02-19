import express from "express";
import jwt from "jsonwebtoken";

import { middleware } from "./middleware";
import { JWT_SECRET } from "./config";

const app = express();
const PORT = 3001;
app.use(express.json());

app.post("/signup", (req, res) => {
    const { username, password } = req.body;

    res.json({
        userId: 123
    })
})

app.post("/signin", (req, res) => {
    const { username, password } = req.body;

    const userId = 1;
    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    res.json({
        token
    })
})

app.post("/create-room", middleware, (req, res) => {
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