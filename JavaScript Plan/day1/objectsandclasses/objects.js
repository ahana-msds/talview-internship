let student = {
    name: "Ahana",
    age: 22,
    skills: ["Python", "JS"]
};

student.city = "Bangalore"; //new property
student.age = 23; //update property

console.log(student.name);
console.log(student["skills"]);
console.log(student.skills[0]);
console.log(student)

