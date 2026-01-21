// property decorator
function Required(target: any, propertyKey: string) {
    if (!target.__requiredProps) {
        target.__requiredProps = [];
    }
    target.__requiredProps.push(propertyKey);
}

class Candidate {
    @Required
    name!: string;

    @Required
    email!: string;
}

const candidate = new Candidate();
console.log(candidate);
