// a generic class to store data of any type

class DataStore<T> {
    private data: T[] = [];

    add(item: T): void {
        this.data.push(item);
    }

    getAll(): T[] {
        return this.data;
    }
}

// number store
const numberStore = new DataStore<number>();
numberStore.add(10);
numberStore.add(20);

// string store
const stringStore = new DataStore<string>();
stringStore.add("ts");
stringStore.add("generics");

console.log(numberStore.getAll());
console.log(stringStore.getAll());
