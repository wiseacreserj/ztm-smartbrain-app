import { Component } from "react";
import Clarifai from "clarifai";

import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";

import "./App.css";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";

const app = new Clarifai.App({
    apiKey: "b08b3f026be94367a1c686a5df524be1",
});

class App extends Component {
    constructor() {
        super();
        this.state = {
            input: "",
            imageUrl: "",
        };
    }

    onInputChange = (event) => {
        this.setState({ input: event.target.value });
    };
    // "a403429f2ddf4b49b307e318f00e5528b"
    onButtonSubmit = () => {
        this.setState({ imageUrl: this.state.input });
        app.models
            .predict("face-detection", this.state.input)
            .then((response) =>
                console.log(
                    response.outputs[0].data.regions[0].region_info.bounding_box
                )
            );
    };

    render() {
        return (
            <>
                <Navigation />
                <Logo />
                <Rank />
                <ImageLinkForm
                    onInputChange={this.onInputChange}
                    onButtonSubmit={this.onButtonSubmit}
                />
                <FaceRecognition imageUrl={this.state.imageUrl} />
            </>
        );
    }
}

export default App;
