import { Component } from "react";
import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from "reactstrap";

class ProfileIcon extends Component {
    constructor(props) {
        super();
        //this.toggle = this.toggle.bind(this);
        this.state = {
            dropdownOpen: false,
        };
    }

    toggle = () => {
        this.setState((prevState) => ({
            dropdownOpen: !prevState.dropdownOpen,
        }));
    };
    render() {
        return (
            <div className="pa4 tc">
                <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                    <DropdownToggle
                        tag={"span"}
                        data-toggle="dropdown"
                        aria-expanded={this.state.dropdownOpen}
                    >
                        <img
                            src="https://img.freepik.com/premium-vector/round-circle-logo-icon-sign-symbol-red-design-vector-illustration_685751-586.jpg"
                            className="br-100 h3 w3 dib"
                            alt="avatar"
                        />
                    </DropdownToggle>
                    <DropdownMenu
                        className="b--transparent shadow-5"
                        style={{
                            marginTop: "20px",
                            backgroundColor: "rgba(255, 255, 255, 0.5)",
                        }}
                    >
                        <DropdownItem>View Profile</DropdownItem>
                        <DropdownItem>Signout</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        );
    }
}

export default ProfileIcon;
