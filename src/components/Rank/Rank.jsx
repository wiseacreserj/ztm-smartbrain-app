import { Component } from "react";

class Rank extends Component {
    constructor(props) {
        super(props);
        this.state = {
            emoji: "",
        };
    }

    componentDidMount() {
        const emoji = this.getEmoji(this.props.entries);
        // this.setState({ emoji });
        // console.log(emoji);
    }

    getEmoji = async (entries) => {
        const response = await fetch(
            `https://azraelemoji.netlify.app/.netlify/functions/emoji?rank=${entries}`
        );
        const data = await response.json();
        this.setState({ emoji: data.emoji });
    };

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.entries === this.props.entries) {
            return null;
        }

        this.getEmoji(this.props.entries);
    }

    render() {
        return (
            <div>
                <div className="white f3">{`${this.props.name}, you current rank is....`}</div>
                <div className="white f1">{`${this.props.entries}`}</div>
                <div className="white f3">Rank Badge:{this.state.emoji}</div>
            </div>
        );
    }
}
/* 
const Rank = ({ name, entries }) => {
    return (
        <div>
            <div className="white f3">{`${name}, you current rank is....`}</div>
            <div className="white f1">{`${entries}`}</div>
        </div>
    );
};
 */
export default Rank;
