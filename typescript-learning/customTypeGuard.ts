type intern = { report: () => void };
type manager = { review: () => void };

// custom type guard function
function isIntern(person: intern | manager): person is intern {
    return (person as intern).report !== undefined;
}

function handle(person: intern | manager) {
    if (isIntern(person)) {
        person.report();
    } else {
        person.review();
    }
}

handle({ report: () => console.log("intern") });
handle({ review: () => console.log("manager") });
