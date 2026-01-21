// method decorator to log execution
function LogExecution(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
        console.log(`method ${propertyKey} called with`, args);
        return originalMethod.apply(this, args);
    };
}

class Evaluator {
    @LogExecution
    evaluate(score: number) {
        return score * 2;
    }
}

const evaluator = new Evaluator();
console.log(evaluator.evaluate(10));
