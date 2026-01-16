interface Props {
    onClick: () => void;
}

export default function Button({ onClick }: Props) {
    return <button onClick={onClick}>Click Me</button>;
}
