import express from "express";
import cors from "cors";
import bcrypt from "bcrypt-nodejs";
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

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("hello");
});

app.post("/signin", (req, res) => {
    const { email, password } = req.body;
    db.select("email", "hash")
        .from("login")
        .where({ email: email })
        .then((data) => {
            const isValid = bcrypt.compareSync(password, data[0].hash);
            if (isValid) {
                db.select("*")
                    .from("users")
                    .where({
                        email: email,
                    })
                    .then((user) => {
                        res.json(user[0]);
                    })
                    .catch((err) => res.status(400).json("Unable to get user"));
            } else res.status(400).json("Wrong credentials");
        })
        .catch((err) => res.status(400).json("Error during signin"));
});

app.post("/register", (req, res) => {
    const { name, email, password } = req.body;
    const hash = bcrypt.hashSync(password);
    db.transaction((trx) => {
        trx.insert({ hash: hash, email: email })
            .into("login")
            .returning("email")
            .then((loginEmail) => {
                return trx("users")
                    .returning("*")
                    .insert({
                        name: name,
                        email: loginEmail[0].email,
                        joined: new Date(),
                    })
                    .then((user) => {
                        res.json(user[0]);
                    });
            })
            .then(trx.commit)
            .catch(trx.rollback);
    }).catch((err) => res.status(404).json("unable to register"));
});

app.get("/profile/:id", (req, res) => {
    const { id } = req.params;
    db.select("*")
        .from("users")
        .where({
            id: id,
        })
        .then((user) => {
            if (user.length) {
                res.json(user[0]);
            } else {
                res.status(400).json("User not found");
            }
        })
        .catch((err) => res.status(400).json("Error getting user"));
});

app.put("/image", (req, res) => {
    const { id } = req.body;
    db("users")
        .where({ id: id })
        .increment("entries", 1)
        .returning("entries")
        .then((result) => res.json(result[0].entries))
        .catch((err) => res.status(400).json("Unable to get entries"));
});

app.listen(3000, () => {
    console.log("App working on port 3000");
});
