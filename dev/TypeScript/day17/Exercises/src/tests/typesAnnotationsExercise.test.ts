import { expect, it } from "@jest/globals";
import { handleFormData } from "../typesAnnotationsExercise";

it("Should handle a form submit", () => {
  const form = document.createElement("form");
  form.innerHTML = `<input name="name" value="John Doe">`;

  const event = new Event("submit", { bubbles: true, cancelable: true });
  Object.defineProperty(event, "target", { value: form, writable: false });

  const result = handleFormData(event);

  expect(result).toEqual({ name: "John Doe" });
});
