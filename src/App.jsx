import { Component } from "react";

import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";

import "./App.css";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Register from "./components/Register/Register";
import Signin from "./components/Signin/Signin";
import Modal from "./components/Modal/Modal";
import Profile from "./components/Profile/Profile";

const initialState = {
    input: "",
    imageUrl: "",
    boxes: [],
    route: "signin",
    isSignedIn: false,
    isProfileOpen: false,
    user: {
        id: "",
        name: "",
        email: "",
        entries: 0,
        joined: "",
        pet: "",
        age: "",
    },
};

class App extends Component {
    constructor() {
        super();
        this.state = initialState;
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

    calculateFaceLocations = (data) => {
        return data.outputs[0].data.regions.map((face) => {
            const clarifaiFace = face.region_info.bounding_box;

            const image = document.getElementById("inputimage");
            const width = Number(image.width);
            const height = Number(image.height);

            return {
                leftCol: clarifaiFace.left_col * width,
                topRow: clarifaiFace.top_row * height,
                rightCol: width - clarifaiFace.right_col * width,
                bottomRow: height - clarifaiFace.bottom_row * height,
            };
        });
    };

    displayFaceBoxes = (boxes) => {
        this.setState({ boxes: boxes });
    };

    onInputChange = (event) => {
        this.setState({ input: event.target.value });
    };

    onButtonSubmit = () => {
        this.setState({ imageUrl: this.state.input });
        fetch("http://localhost:3000/imageurl", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                input: this.state.input,
            }),
        })
            .then((response) => response.json())
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
                this.displayFaceBoxes(this.calculateFaceLocations(response));
            })
            .catch((err) => console.log(err));
    };

    onRouteChange = (route) => {
        if (route === "signout") {
            this.setState(initialState);
        } else if (route === "home") {
            this.setState({ isSignedIn: true });
        }
        this.setState({ route: route });
    };

    toggleModal = () => {
        this.setState((prevState) => ({
            ...prevState,
            isProfileOpen: !prevState.isProfileOpen,
        }));
    };

    render() {
        const { imageUrl, route, boxes, isSignedIn, user, isProfileOpen } =
            this.state;
        return (
            <>
                <Navigation
                    isSignedIn={isSignedIn}
                    onRouteChange={this.onRouteChange}
                    toggleModal={this.toggleModal}
                />
                {isProfileOpen ? (
                    <Modal>
                        <Profile
                            isProfileOpen={isProfileOpen}
                            toggleModal={this.toggleModal}
                            user={user}
                        />
                    </Modal>
                ) : null}
                {route === "home" ? (
                    <>
                        <Logo />

                        <Rank name={user.name} entries={user.entries} />
                        <ImageLinkForm
                            onInputChange={this.onInputChange}
                            onButtonSubmit={this.onButtonSubmit}
                        />
                        <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
                    </>
                ) : route === "signin" || route === "signout" ? (
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
