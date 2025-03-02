import { Component } from "react";

class ProfileIcon extends Component {
    constructor(props) {
        super();
        this.state = {
            dropdownOpen: false,
        };
    }

    render() {
        return (
            <div className="pa4 tc">
                <img
                    src="https://img.freepik.com/premium-vector/round-circle-logo-icon-sign-symbol-red-design-vector-illustration_685751-586.jpg"
                    className="br-100 h3 w3 dib"
                    alt="avatar"
                />
            </div>
        );
    }
}

export default ProfileIcon;
