const { chunkArray, deepCloneObject, uniqueValues, pickProperties } = require('../../src/utils/lodash-examples');

describe('Lodash Utility Wrapper Tests (Jest)', () => {

    test('chunkArray should split array into chunks', () => {
        const input = ['a', 'b', 'c', 'd'];
        const result = chunkArray(input, 2);
        expect(result).toEqual([['a', 'b'], ['c', 'd']]);
    });

    test('deepCloneObject should create a deep copy', () => {
        const original = { a: 1, nested: { b: 2 } };
        const copy = deepCloneObject(original);

        // Assert they look the same
        expect(copy).toEqual(original);

        // Assert they are different references
        expect(copy).not.toBe(original);
        expect(copy.nested).not.toBe(original.nested);

        // Modifying copy shouldn't affect original
        copy.nested.b = 3;
        expect(original.nested.b).toBe(2);
    });

    test('uniqueValues should remove duplicates', () => {
        const input = [2, 1, 2];
        const result = uniqueValues(input);
        expect(result).toEqual([2, 1]); // Order is preserved in Lodash uniq usually
    });

    test('pickProperties should create object with selected keys', () => {
        const object = { 'a': 1, 'b': '2', 'c': 3 };
        const result = pickProperties(object, ['a', 'c']);
        expect(result).toEqual({ 'a': 1, 'c': 3 });
    });
});
