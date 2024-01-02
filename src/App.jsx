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
            box: {},
        };
    }

    calculateFaceLocation = (data) => {
        const clarifaiFace =
            data.outputs[0].data.regions[0].region_info.bounding_box;
        console.log(clarifaiFace);
        const image = document.getElementById("inputimage");
        const width = Number(image.width);
        const height = Number(image.height);
        console.log(width - clarifaiFace.right_col * width);
        return {
            leftCol: clarifaiFace.left_col * width,
            topRow: clarifaiFace.top_row * height,
            rightCol: width - clarifaiFace.right_col * width,
            bottomRow: height - clarifaiFace.bottom_row * height,
        };
    };

    displayFaceBox = (box) => {
        console.log(box);
        this.setState({ box: box });
    };

    onInputChange = (event) => {
        this.setState({ input: event.target.value });
    };

    onButtonSubmit = () => {
        this.setState({ imageUrl: this.state.input });
        app.models
            .predict("face-detection", this.state.input)
            .then((response) =>
                this.displayFaceBox(this.calculateFaceLocation(response))
            )
            .catch((err) => console.log(err));
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
                <FaceRecognition
                    box={this.state.box}
                    imageUrl={this.state.imageUrl}
                />
            </>
        );
    }
}

export default App;
