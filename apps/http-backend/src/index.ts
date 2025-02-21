import express from "express";
import jwt from "jsonwebtoken";

import { middleware } from "./middleware";
import { JWT_SECRET } from "@repo/backend-utils/config";
import { CreateRoomSchema, CreateUserSchema, SignInSchema } from "@repo/common-utils/types";
import { prisma } from "@repo/db/client";
import cors from "cors";

const app = express();
const PORT = 3001;
app.use(express.json());
app.use(cors());

app.post("/signup", async (req, res) => {
    const parsedData = CreateUserSchema.safeParse(req.body);
    if(!parsedData.success) {
        console.log(parsedData.error);
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }

    const { username, password, name } = parsedData.data;

    try {   
        // db call
        const User = await prisma.user.create({
            data: {
                username,
                password,
                name
            }
        })
        res.json({
            userId: User.id
        })
    } catch(e) {
        res.status(411).json({
            message: "User already exists with same username"
        })
    }
})

app.post("/signin", async (req, res) => {
    const parsedData = SignInSchema.safeParse(req.body);
    if(!parsedData.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }
    const { username, password } = parsedData.data;

    // db call
    const User = await prisma.user.findFirst({
        where: {
            username,
            password
        }
    })

    if(!User) {
        res.status(403).json({
            message: "User not found"
        })
        return;
    }

    const userId = User.id;
    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    res.json({
        token
    })
})

app.post("/create-room", middleware, async (req, res) => {
    const parsedData = CreateRoomSchema.safeParse(req.body);
    if(!parsedData.success) {
        console.log(parsedData.error);
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }
    //@ts-ignore
    const userId = req.userId;

    try {
        const Room = await prisma.room.create({
            data: {
                slug: generateSlug(),      // 'mkg-ijzh-pou'
                adminId: userId
            }
        })
        
        res.json({
            Room
        })         
    } catch(e) {
        res.status(411).json({
            message: "Duplicate slug"
        })
    }
})

app.get("/chats/:roomId", async (req, res) => {
    const roomId = parseInt(req.params.roomId);
    try {        
        const messages = await prisma.chat.findMany({
            where: {
                roomId: roomId
            },
            orderBy: {
                id: 'desc'
            },
            take: 50
        })
        res.json({
            messages
        })           
    } catch(e) {
        res.json({
            messages: []
        })
    }
})

app.get("/room/:slug", async (req, res) => {
    const slug = req.params.slug;
    const room = await prisma.room.findMany({
        where: {
            slug: slug
        }
    })
    res.json({
        room
    })
})

app.listen(PORT, () => {
    console.log(`Server is listening at port ${PORT}`);
})


const generateSlug = (): string => {
    let options = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

    let slug = "";
    for (let i = 0; i < 10; i++) {
        // use a simple function here
        slug += options[Math.floor(Math.random() * options.length)];
    }

    slug = slug.slice(0, 3) + '-' + slug.slice(3, 7) + '-' + slug.slice(7, 10);
    console.log(slug);
    return slug;
}