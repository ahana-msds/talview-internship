// type assertion tells TS "trust me, I know the type"

const value: unknown = "typescript";

// asserting unknown as string
const length = (value as string).length;

console.log(length);
