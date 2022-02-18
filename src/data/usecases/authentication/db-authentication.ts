import { loadAccountByEmailRepository } from "../../protocols/db/load-account-by-email-repository";
import { Authentication, AuthenticationModel } from "../../../domain/usecases/authentication";

export class DbAuthentication implements Authentication {
    private readonly loadAccountByEmailRepository: loadAccountByEmailRepository

    constructor(loadAccountByEmailRepository: loadAccountByEmailRepository) {
        this.loadAccountByEmailRepository = loadAccountByEmailRepository
    }

    async auth(authentication: AuthenticationModel): Promise<string> {
        await this.loadAccountByEmailRepository.load(authentication.email)
        return null
    }

}