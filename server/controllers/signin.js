import jwt from "jsonwebtoken";
import redis from "redis";

//setup Redis
const redisClient = redis.createClient({
    host: "localhost",
});

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

const getAuthTokenId = () => {
    console.logg("auth ok");
};

const signToken = (email) => {
    const jwtPayload = { email };
    return jwt.sign(jwtPayload, "JWT_SECRET", {
        expiresIn: "2 days",
    });
};

const createSessions = (user) => {
    //JWT token, return user data
    const { id, email } = user;
    const token = signToken(email);
    return { succes: true, userId: id, token };
};

export const signinAuthentication = (db, bcrypt) => (req, res) => {
    const { authorization } = req.headers;
    console.log("auth func");
    return authorization
        ? getAuthTokenId()
        : handleSignin(db, bcrypt, req, res)
              .then((data) => {
                  return data.id && data.email
                      ? createSessions(data)
                      : Promise.reject(data);
              })
              .then((session) => res.json(session))
              .catch((err) => res.status(400).json(err));
};
