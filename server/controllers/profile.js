export const handleProfie = (db) => (req, res) => {
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
};

export const handleProfieUpdate = (db) => (req, res) => {
    const { id } = req.params;
    const { name, age, pet } = req.body.formInput;
    db("users")
        .where({ id })
        .update({ name })
        .then((resp) => {
            if (resp) {
                res.json("succes");
            } else {
                res.status(400).json("Unable to update");
            }
        })
        .catch((err) => res.status(400).json("error updating user"));
};
