import { Component } from "react";
import Clarifai from "clarifai";

import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";

import "./App.css";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Register from "./components/Register/Register";
import Signin from "./components/Signin/Signin";

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
            route: "signin",
            isSignedIn: false,
            user: {
                id: "",
                name: "",
                email: "",
                entries: 0,
                joined: "",
            },
        };
    }

    loadUser = (user) => {
        this.setState({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                entries: user.entries,
                joined: user.joined,
            },
        });
    };

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
            .then((response) => {
                if (response) {
                    fetch("http://localhost:3000/image", {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            id: this.state.user.id,
                        }),
                    })
                        .then((response) => response.json())
                        .then((entries) => {
                            this.setState({
                                user: { ...this.state.user, entries: entries },
                            });
                        });
                }
                this.displayFaceBox(this.calculateFaceLocation(response));
            })
            .catch((err) => console.log(err));
    };

    onRouteChange = (route) => {
        if (route === "signout") {
            this.setState({ isSignedIn: false });
        } else if (route === "home") {
            this.setState({ isSignedIn: true });
        }
        this.setState({ route: route });
    };

    render() {
        const { imageUrl, route, box, isSignedIn, user } = this.state;
        return (
            <>
                <Navigation
                    isSignedIn={isSignedIn}
                    onRouteChange={this.onRouteChange}
                />
                {route === "home" ? (
                    <>
                        <Logo />
                        <Rank name={user.name} entries={user.entries} />
                        <ImageLinkForm
                            onInputChange={this.onInputChange}
                            onButtonSubmit={this.onButtonSubmit}
                        />
                        <FaceRecognition box={box} imageUrl={imageUrl} />
                    </>
                ) : route === "signin" ? (
                    <Signin
                        onRouteChange={this.onRouteChange}
                        loadUser={this.loadUser}
                    />
                ) : (
                    <Register
                        onRouteChange={this.onRouteChange}
                        loadUser={this.loadUser}
                    />
                )}
            </>
        );
    }
}
export default App;
