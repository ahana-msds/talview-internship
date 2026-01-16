export const getUser = async (id) => {
    const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${id}`
    );

    if (!response.ok) {
        throw new Error("User not found (API error)");
    }

    const data = await response.json();

    if (!data || !data.id) {
        throw new Error("Invalid user data");
    }

    return data;
};
