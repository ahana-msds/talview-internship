export const fetchUpdates = async () => {
    return new Promise<any[]>((resolve) =>
        setTimeout(
            () =>
                resolve([
                    { id: 1, title: "day 1 update", description: "react basics" },
                    { id: 2, title: "day 2 update", description: "hooks and routing" }
                ]),
            800
        )
    );
};
