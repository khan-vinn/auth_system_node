
describe('Sample Test', () => {
    it('should test that true === true', () => {
        expect(true).toBe(true)
    })
    it("udefined", () => {
        expect(undefined).toBe(undefined)
    })
})

function add(x = 0, y = 0) {
    return x + y
}

describe("Add function test", () => {
    it("add two numbers", () => {
        expect(add(1, 3)).toBe(4)
    })
    it("add only one numbers", () => {
        expect(add(5)).toBe(5)
    })
    it("add no nubers", () => {
        expect(add()).toBe(0)
    })
})