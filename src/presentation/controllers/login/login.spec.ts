import { InvalidParamError, MissingParamError } from "../../../presentation/errors"
import { anauthorized, badRequest, ok, serverError } from "../../helpers/http/http-helper"
import { EmailValidator, HttpRequest, Authentication, AuthenticationModel } from "./login-protocols"
import { LoginController } from "./login"

const makeAuthentication = (): Authentication => {
    class AuthenticationStub implements Authentication {
        async auth(authentication: AuthenticationModel): Promise<string> {
            return new Promise(resolve => resolve('any_token'))
        }
    }
    return new AuthenticationStub()
}

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true
        }
    }
    return new EmailValidatorStub()
}

const makeFakeRequest = (): HttpRequest => ({
    body: {
        email: 'any_email@email.com',
        password: 'any_password'
    }
})

interface SutTypes {
    sut: LoginController,
    emailValidatorStub: EmailValidator,
    authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
    const emailValidatorStub = makeEmailValidator()
    const authenticationStub = makeAuthentication()
    const sut = new LoginController(emailValidatorStub, authenticationStub)
    return {
        sut,
        emailValidatorStub,
        authenticationStub
    }
}

describe('Login Controller', () => {
    test('Should call EmailValidator with correct email', async () => {
        const { sut, emailValidatorStub } = makeSut()
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

        await sut.handle(makeFakeRequest())
        expect(isValidSpy).toHaveBeenCalledWith('any_email@email.com')
    })

    test('Should return 500 if EmailValidator throws', async () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error()
        })

        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(serverError(new Error()))
    })

    test('Should call Authentication with correct values', async () => {
        const { sut, authenticationStub } = makeSut()
        const isAuth = jest.spyOn(authenticationStub, 'auth')

        await sut.handle(makeFakeRequest())
        expect(isAuth).toHaveBeenCalledWith({ email: 'any_email@email.com', password: 'any_password' })
    })

    test('Should return 401 if an invalid credentials are provided', async () => {
        const { sut, authenticationStub } = makeSut()
        jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise(resolve => resolve(null)))

        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(anauthorized())
    })

    test('Should return 500 if Authentication throws', async () => {
        const { sut, authenticationStub } = makeSut()
        jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce((new Promise((resolve, reject) => reject(new Error()))))

        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(serverError(new Error()))
    })

    test('Should return 200 if valid credentials are provided', async () => {
        const { sut } = makeSut()

        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
    })
})
