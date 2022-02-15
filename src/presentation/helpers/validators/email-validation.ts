import { EmailValidator } from "../../protocols/email-validator";
import { InvalidParamError } from "../../errors";
import { Validation } from "./validation";

export class EmailValidation implements Validation {
    private readonly emailValidator: EmailValidator
    private readonly fieldName: string

    constructor(fieldName: string, emailValidator: EmailValidator,) {
        this.emailValidator = emailValidator
        this.fieldName = fieldName
    }

    validate(input: any): Error {
        const isValid = this.emailValidator.isValid(input[this.fieldName])
        if (!isValid) {
            return new InvalidParamError(this.fieldName)
        }
    }
}