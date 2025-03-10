export const handleRegister = (db, bcrypt) => (req, res) => {
    const { name, email, password } = req.body;
    console.log(name, email, password);
    if (!email || !name || !password) {
        return res.status(400).json("incorrect form data!");
    }
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
};
