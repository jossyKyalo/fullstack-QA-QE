"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const typesAnnotationsExercise_1 = require("../typesAnnotationsExercise");
(0, globals_1.it)("Should handle a form submit", () => {
    const form = document.createElement("form");
    form.innerHTML = `<input name="name" value="John Doe">`;
    const event = new Event("submit", { bubbles: true, cancelable: true });
    Object.defineProperty(event, "target", { value: form, writable: false });
    const result = (0, typesAnnotationsExercise_1.handleFormData)(event);
    (0, globals_1.expect)(result).toEqual({ name: "John Doe" });
});
