// Type for input component props
type Props = {
    label: string;                             // label text
    value: string;                             // current input value
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;                             // optional input type
};

// Reusable input component
function InputField({ label, value, onChange, type = "text" }: Props) {
    return (
        <div style={{ marginBottom: "10px" }}>
            {/* Label shown above input */}
            <label>{label}</label>

            {/* Input box */}
            <input
                type={type}           // text / email etc.
                value={value}         // controlled input
                onChange={onChange}   // change event handler
            />
        </div>
    );
}

// Exporting for reuse
export default InputField;
