import { Encrypter } from "../../protocols/encrypter"
import { DbAddAccount } from "./db-add-account"


interface SutTypes {
    sut: DbAddAccount,
    encrypterStub: Encrypter
}

const makeEncryter = (): Encrypter => {
    class EncrypterStub implements Encrypter {
        async encrypt(value: string): Promise<string> {
            return new Promise(resolve => resolve('hashed_password'))
        }
    }
    return new EncrypterStub
}
const makeSut = (): SutTypes => {
    const encrypterStub = makeEncryter()
    const sut = new DbAddAccount(encrypterStub)
    return {
        sut,
        encrypterStub
    }
}


describe('DbAddAccount Usecase', () => {
    test('Should call encrypter with correct password', async () => {
        const { sut, encrypterStub } = makeSut()
        const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
        const accountData = {
            name: 'valid_name',
            email: 'valid_email@email.com',
            password: 'valid_password'
        }

        await sut.add(accountData)
        expect(encryptSpy).toHaveBeenCalledWith('valid_password')
    })
})