export const fetchUsersApi = async (query) => {
    // simulate network delay
    await new Promise((resolve) =>
        setTimeout(resolve, 1000)
    );

    if (!query) {
        return [];
    }

    if (query === "error") {
        throw new Error("api error occurred");
    }

    return [
        { id: 1, name: `${query} user 1` },
        { id: 2, name: `${query} user 2` },
    ];
};
