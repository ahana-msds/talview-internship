// typeof guard
function printValue(value: string | number) {
    if (typeof value === "string") {
        console.log("string:", value);
    } else {
        console.log("number:", value);
    }
}

// instanceof guard
class Car {
    drive() {
        console.log("driving");
    }
}

class Bike {
    ride() {
        console.log("riding");
    }
}

function useVehicle(vehicle: Car | Bike) {
    if (vehicle instanceof Car) {
        vehicle.drive();
    } else {
        vehicle.ride();
    }
}

printValue("hello");
printValue(42);

useVehicle(new Car());
useVehicle(new Bike());
