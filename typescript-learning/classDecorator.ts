// enable decorators in tsconfig:
// "experimentalDecorators": true

// class decorator
function Logger(constructor: Function) {
    console.log(`class created: ${constructor.name}`);
}

@Logger
class InterviewSession {
    constructor(public candidateName: string) { }
}

const session = new InterviewSession("Ahana");
