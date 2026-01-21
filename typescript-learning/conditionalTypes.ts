// conditional type
type ApiResponse<T> = T extends string
    ? { message: T }
    : { data: T };

// inferred at compile time
const textResponse: ApiResponse<string> = {
    message: "success"
};

const dataResponse: ApiResponse<number[]> = {
    data: [1, 2, 3]
};

console.log(textResponse, dataResponse);
