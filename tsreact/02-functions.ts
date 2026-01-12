interface Employee {
    name: string;
    id: number;
}

function greet(employee: Employee): string {
    return `Hello ${employee.name}, id ${employee.id}`;
}

const s1: Employee = {
    name: "Ahana",
    id: 1505
};

console.log(greet(s1));
