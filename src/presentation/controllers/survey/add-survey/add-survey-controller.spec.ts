import { Validation } from "./../../../protocols/validation";
import { HttpRequest } from "./add-survey-controller-protocols";
import { AddSurveyController } from "./add-survey-controller";

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: "any_question",
    answer: [
      {
        image: "any_image",
        answer: "any_answer",
      },
    ],
  },
});

describe("AddSurvey Controller", () => {
  test("Should call validation with correct values", async () => {
    class ValidationStub implements Validation {
      validate(input: any): Error {
        return new Error(null);
      }
    }
    const validationStub = new ValidationStub();
    const validateSpy = jest.spyOn(validationStub, "validate");

    const sut = new AddSurveyController(validationStub);
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });
});
