import express from "express";
import cors from "cors";
import knex from "knex";

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

console.log(db.select("*").from("users"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const database = {
    users: [
        {
            id: "123",
            name: "John",
            email: "john@gmail.com",
            password: "pass1",
            entries: 0,
            joined: new Date(),
        },
        {
            id: "124",
            name: "Sally",
            email: "sally@gmail.com",
            password: "pass2",
            entries: 0,
            joined: new Date(),
        },
    ],
};

app.get("/", (req, res) => {
    res.send(database.users);
});

app.post("/signin", (req, res) => {
    if (
        req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password
    ) {
        res.json(database.users[0]);
    } else {
        res.status(400).json("error logging in");
    }
});

app.post("/register", (req, res) => {
    const { name, email, password } = req.body;
    database.users.push({
        id: "125",
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date(),
    });
    const newUser = database.users[database.users.length - 1];
    delete newUser.password;
    res.json(newUser);
});

app.get("/profile/:id", (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach((user) => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        }
    });
    if (!found) {
        res.status(401).json("user not found");
    }
});

app.put("/image", (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach((user) => {
        if (user.id === id) {
            found = true;
            user.entries++;
            return res.json(user.entries);
        }
    });
    if (!found) {
        res.status(401).json("user not found");
    }
});

app.listen(3000, () => {
    console.log("App working on port 3000");
});
