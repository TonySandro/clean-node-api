export class EmailInUseError extends Error {
    constructor() {
        super(`The received emais is already in use!`)
        this.name = 'EmailInUseError'
    }
}