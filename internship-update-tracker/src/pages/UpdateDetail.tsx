import React from "react";
import { useParams } from "react-router-dom";

const UpdateDetail: React.FC = () => {
    const { id } = useParams();

    return (
        <div className="page">
            <h2>update detail</h2>
            <p>update id: {id}</p>
        </div>
    );
};

export default UpdateDetail;
