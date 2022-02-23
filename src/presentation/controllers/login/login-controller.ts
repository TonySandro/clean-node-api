import { InvalidParamError, MissingParamError } from "../../errors"
import { anauthorized, badRequest, ok, serverError } from "../../helpers/http/http-helper"
import { Controller, EmailValidator, HttpRequest, HttpResponse, Authentication } from "./login-controller-protocols";

export class LoginController implements Controller {
    private readonly emailValidator: EmailValidator
    private readonly authentication: Authentication

    constructor(emailValidator: EmailValidator, authentication: Authentication) {
        this.emailValidator = emailValidator
        this.authentication = authentication
    }

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const requireFields = ['email', 'password']
            for (const field of requireFields) {
                if (!httpRequest.body[field]) {
                    return badRequest(new MissingParamError(field))
                }
            }

            const { email, password } = httpRequest.body
            const isValid = this.emailValidator.isValid(email)
            if (!isValid) {
                return badRequest(new InvalidParamError('email'))
            }

            const accessToken = await this.authentication.auth({ email, password })
            if (!accessToken) {
                return anauthorized()
            }

            return ok({ accessToken })
        } catch (error) {
            return serverError(error)
        }
    }
}