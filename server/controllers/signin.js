import jwt from "jsonwebtoken";
import redis from "redis";

//setup Redis
export const redisClient = await redis
    .createClient(/* {
        host: "localhost",
    } */)
    .connect();

export const handleSignin = (db, bcrypt, req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return Promise.reject("incorrect form submission");
    }
    return db
        .select("email", "hash")
        .from("login")
        .where({ email: email })
        .then((data) => {
            const isValid = bcrypt.compareSync(password, data[0].hash);
            if (isValid) {
                return db
                    .select("*")
                    .from("users")
                    .where({
                        email: email,
                    })
                    .then((user) => user[0])
                    .catch((err) => Promise.reject("Unable to get user"));
            } else Promise.reject("Wrong credentials");
        })
        .catch((err) => res.status(400).json("Error during signin"));
};

const getAuthTokenId = (req, res) => {
    const { authorization } = req.headers;
    redisClient.get(authorization).then((reply) => {
        if (!reply) {
            return res.status(400).json("Unauthorized");
        } else {
            return res.json({ id: reply });
        }
    });
};

const signToken = (email) => {
    const jwtPayload = { email };
    return jwt.sign(jwtPayload, "JWT_SECRET", {
        expiresIn: "2 days",
    });
};

const setToken = async (key, value) => {
    /* await redisClient.set("key", "value");
    const data = await redisClient.get("key");
    console.log(data); */
    return Promise.resolve(redisClient.set(key, value));
};

const createSessions = (user) => {
    //JWT token, return user data
    const { id, email } = user;
    const token = signToken(email);
    return setToken(token, id)
        .then(() => {
            console.log({ success: true, userId: id, token });
            return { success: true, userId: id, token };
        })
        .catch(console.log);
};

export const signinAuthentication = (db, bcrypt) => (req, res) => {
    const { authorization } = req.headers;

    console.log("auth func");
    return authorization
        ? getAuthTokenId(req, res)
        : handleSignin(db, bcrypt, req, res)
              .then((data) => {
                  return data.id && data.email
                      ? createSessions(data)
                      : Promise.reject(data);
              })
              .then((session) => res.json(session))
              .catch((err) => res.status(400).json(err));
};
