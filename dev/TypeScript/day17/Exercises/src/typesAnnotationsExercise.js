"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFormData = exports.example5 = exports.example4 = exports.example3 = exports.example2 = exports.example1 = exports.add = void 0;
//exercise 1: basic types with function parameters
const add = (a, b) => {
    return a + b;
};
exports.add = add;
const result = (0, exports.add)(1, 2);
console.log(result);
//exercise 2: Annotating Empty Parameters
const concatTwoStrings = (a, b) => {
    return [a, b].join(" ");
};
const result2 = concatTwoStrings("Hello", "World");
console.log(result2);
//exercise 3: Basic types
exports.example1 = "Hello Wolrd!";
exports.example2 = 42;
exports.example3 = true;
exports.example4 = Symbol();
exports.example5 = 123n;
//exercise 4: The any type
const handleFormData = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const value = Object.fromEntries(data.entries());
    return value;
};
exports.handleFormData = handleFormData;
//   it("Should handle a form submit", () => {
//     const form = document.createElement("form");
//     form.innerHTML = `
//   <input name="name" value="John Doe"></Exercise>
//   `;
//     form.onsubmit = (e) => {
//       const value = handleFormData(e);
//       expect(value).toEqual({ name: "John Doe" });
//     };
//     form.requestSubmit();
//     expect.assertions(1);
//   });  
//Object Literal types
//1. Object Literal types
