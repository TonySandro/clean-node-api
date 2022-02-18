import { loadAccountByEmailRepository } from "data/protocols/load-account-by-email-repository"
import { AccountModel } from "../add-account/db-add-account-protocols"
import { DbAuthentication } from "./db-authentication"

class LoadAccountByEmailRepositoryStub implements loadAccountByEmailRepository {
    async load(email: string): Promise<AccountModel> {
        const account: AccountModel = {
            id: 'any_id',
            name: 'any_name',
            email: 'any_email@email.com',
            password: 'any_password',
        }
        return new Promise(resolve => resolve(account))
    }
}

interface SutType {
    sut: DbAuthentication
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepositoryStub
}

const makeSut = (): SutType => {
    const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub()
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)
    return {
        sut,
        loadAccountByEmailRepositoryStub
    }
}

describe('DbAuthentication UseCase', () => {
    test('Should call LoadAccountByEmailRepository with correct email', () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')

        sut.auth({
            email: 'any_email@email.com',
            password: 'any_password',
        })

        expect(loadSpy).toHaveBeenCalledWith('any_email@email.com')
    })
})
