var assert = require('assert');

const lowdb = require('lowdb');
const Memory = require('lowdb/adapters/Memory');
const db = lowdb(new Memory());
db.defaults({ 'test': [] }).write();

describe('Database', function () {
    const collection = db.get('test');

    beforeEach(() => {
        // console.log("Before each");
        collection.remove({}).write();
        // collection.set([]).write();
    });

    describe("Collection", () => {
        it("Is array", () => {
            assert.strictEqual(collection.value() instanceof Array, true)
        });
        it("Is empty", () => {
            assert.strictEqual(collection.value().length, 0)
        });
    });

    describe('Push value', function () {
        const data = { id: "newId", "name": "Moshe", "age": 16 };

        it('Should exist', () => {
            collection.push(data).write();

            assert(collection.find({ id: 'newId' }).value() !== undefined)
        });

        it("Should be moshe", () => {
            collection.push(data).write();
            assert.strictEqual(collection.find({ id: 'newId' }).value().name, "Moshe");
        })
    });

    describe("Make sure it's cleared beforeEach", function () {
        it("Value newId doesn't exist", function () {
            assert.strictEqual(collection.find({ id: 'newId' }).value(), undefined);
        });
    });

    describe('Replace value - the REAL test', function () {
        const data = { id: "newId", "name": "Moshe", "age": 16 };

        it('Final name should be Bobo', () => {
            collection.push(data).write();
            const existing = collection.find({ id: 'newId' }).value();
            // Update
            if (existing !== undefined) {
                collection.find({ id: 'newId' }).assign( { name: "Bobo" }).write();
            }

            assert.strictEqual(collection.find({ id: 'newId' }).value().name, "Bobo");
        });
    });
});