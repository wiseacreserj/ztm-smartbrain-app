import express from "express";
import cors from "cors";
import bcrypt from "bcrypt-nodejs";
import knex from "knex";

import { handleRegister } from "./controllers/register.js";
import { handleSignin } from "./controllers/signin.js";
import { handleProfie } from "./controllers/profile.js";
import { handleImage, handleClarifaiApiCall } from "./controllers/image.js";

const app = express();

const db = knex({
    client: "pg",
    connection: {
        host: "localhost",
        user: "admin",
        password: "admin",
        database: "ztm-smartbrain",
    },
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("hello");
});

app.post("/signin", handleSignin(db, bcrypt));

app.post("/register", handleRegister(db, bcrypt));

app.get("/profile/:id", handleProfie(db));

app.put("/image", handleImage(db));
app.post("/imageurl", handleClarifaiApiCall);

app.listen(3000, () => {
    console.log("App working on port 3000");
});
