const FaceRecognition = ({ imageUrl }) => {
    return (
        <div className="f-center ma">
            <div className="mt2">
                <img src={imageUrl} alt="" width={"500px"} height={"auto"} />
            </div>
        </div>
    );
};

export default FaceRecognition;
