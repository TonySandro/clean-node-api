import { loadAccountByEmailRepository } from "data/protocols/db/load-account-by-email-repository"
import { AuthenticationModel } from "domain/usecases/authentication"
import { AccountModel } from "../add-account/db-add-account-protocols"
import { DbAuthentication } from "./db-authentication"

const makeFakeAccount = (): AccountModel => ({
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'any_password',
})

const makeFakeAuthentication = (): AuthenticationModel => ({
    email: 'any_email@email.com',
    password: 'any_password',
})

const makeLoadAccountByEmailRepository = (): loadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements loadAccountByEmailRepository {
        async load(email: string): Promise<AccountModel> {
            return new Promise(resolve => resolve(makeFakeAccount()))
        }
    }
    return new LoadAccountByEmailRepositoryStub()
}

interface SutType {
    sut: DbAuthentication
    loadAccountByEmailRepositoryStub: loadAccountByEmailRepository
}

const makeSut = (): SutType => {
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)
    return {
        sut,
        loadAccountByEmailRepositoryStub
    }
}

describe('DbAuthentication UseCase', () => {
    test('Should call LoadAccountByEmailRepository with correct email', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')

        await sut.auth(makeFakeAuthentication())
        expect(loadSpy).toHaveBeenCalledWith('any_email@email.com')
    })

    test('Should throw if LoadAccountByEmailRepository throws', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

        const promise = sut.auth(makeFakeAuthentication())
        await expect(promise).rejects.toThrow()
    })

    test('Should return null if LoadAccountByEmailRepository returns null', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(null)

        const accessToken = await sut.auth(makeFakeAuthentication())
        expect(accessToken).toBeNull()
    })
})
