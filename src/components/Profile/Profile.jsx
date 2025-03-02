import "./Profile.css";

const Profile = ({ isProfileOpen, toggleModal }) => {
    return (
        <div className="profile-modal">
            <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center bg-white">
                {/* <div className="modal-close" onClick={toggleModal}>
                    &times;
                </div> */}
                <main className="pa4 black-80 w-80 center">
                    <h1>John Doe</h1>
                    <h4>Image Submitted: 5</h4>
                    <p>Member since: January</p>
                    <hr />
                    <label htmlFor="user-name" className="mt2 fw6">
                        Name:
                    </label>
                    <input
                        className="pa2 ba w-100"
                        type="text"
                        name="user-name"
                        id="name"
                        placeholder="john"
                    />
                    <label htmlFor="user-age" className="mt2 fw6">
                        Age:
                    </label>
                    <input
                        className="pa2 ba w-100"
                        type="text"
                        name="user-age"
                        id="age"
                        placeholder="56"
                    />
                    <label htmlFor="user-name" className="mt2 fw6">
                        Pet:
                    </label>
                    <input
                        className="pa2 ba w-100"
                        type="text"
                        name="user-pet"
                        id="pet"
                        placeholder="dragon"
                    />
                    <div
                        className="mt4"
                        style={{
                            display: "flex",
                            justifyContent: "space-evenly",
                        }}
                    >
                        <button className="b pa2 grow pointer hover-white w-40 bg-light-blue b--black-20">
                            Save
                        </button>
                        <button
                            className="b pa2 grow pointer hover-white w-40 bg-light-red b--black-20"
                            onClick={toggleModal}
                        >
                            Cancel
                        </button>
                    </div>
                </main>
            </article>
        </div>
    );
};

export default Profile;
