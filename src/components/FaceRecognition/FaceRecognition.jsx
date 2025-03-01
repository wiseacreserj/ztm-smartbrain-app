import "./FaceRecognition.css";

const FaceRecognition = ({ imageUrl, boxes }) => {
    return (
        <div className="f-center ma">
            <div className="mt2" style={{ position: "relative" }}>
                <img
                    id="inputimage"
                    src={imageUrl}
                    alt=""
                    width={"500px"}
                    height={"auto"}
                />

                {boxes.map((box, index) => {
                    return (
                        <div
                            key={index}
                            className="bounding-box"
                            style={{
                                top: box.topRow,
                                right: box.rightCol,
                                bottom: box.bottomRow,
                                left: box.leftCol,
                            }}
                        ></div>
                    );
                })}
            </div>
        </div>
    );
};

export default FaceRecognition;
