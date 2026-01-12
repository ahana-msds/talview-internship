type CardProps = {
    name: string;
    description: string;
};

const Card = ({ name, description }: CardProps) => {
    return (
        <div
            style={{
                border: "1px solid #ccc",
                padding: "12px",
                margin: "10px 0",
                borderRadius: "8px",
            }}
        >
            <h3>{name}</h3>
            <p>{description}</p>
        </div>
    );
};

export default Card;
