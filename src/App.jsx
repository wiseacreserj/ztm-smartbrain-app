import Navigation from "./components/Navigation/Navigation";
import "./App.css";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";

function App() {
    return (
        <>
            <Navigation />
            <Logo />
            <Rank />
            <ImageLinkForm />
        </>
    );
}

export default App;
