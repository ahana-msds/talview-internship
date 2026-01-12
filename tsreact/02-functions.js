function greet(employee) {
    return "Hello ".concat(employee.name, ", id ").concat(employee.id);
}
var s1 = {
    name: "Ahana",
    id: 1505
};
console.log(greet(s1));
