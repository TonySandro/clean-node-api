import { MissingParamError } from "../errors/missing-param-error"
import { badRequest } from "../helpers/http-helper"
import { Controller } from "../protocols/controller"
import { HttpRequest, HttpResponse } from "../protocols/http"

export class SignUpController implements Controller {
    handle(httpRequest: HttpRequest): HttpResponse {
        let fieldResult = ''
        const requireFields = ['name', 'email', 'password', 'passwordConfirmation']
        for (const field of requireFields) {
            if (!httpRequest.body[field]) {
                fieldResult = field
            }
        }
        return badRequest(new MissingParamError(fieldResult))
    }
}