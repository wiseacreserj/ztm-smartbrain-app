import Clarifai from "clarifai";

const app = new Clarifai.App({
    apiKey: "b08b3f026be94367a1c686a5df524be1",
});

export const handleClarifaiApiCall = (req, res) => {
    app.models
        .predict("face-detection", req.body.input)
        .then((data) => {
            res.json(data);
        })
        .catch((err) => res.status(400).json("unable work with API"));
};

export const handleImage = (db) => (req, res) => {
    const { id } = req.body;
    db("users")
        .where({ id: id })
        .increment("entries", 1)
        .returning("entries")
        .then((result) => res.json(result[0].entries))
        .catch((err) => res.status(400).json("Unable to get entries"));
};
