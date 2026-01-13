type Props = {
    onClick: () => void;
};

function Button({ onClick }: Props) {
    console.log("button component rendered");
    return <button onClick={onClick}>child button</button>;
}

export default Button;
