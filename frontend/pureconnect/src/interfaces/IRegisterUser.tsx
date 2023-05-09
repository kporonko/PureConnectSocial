export interface IRegisterUser{
    email: string,
    password: string,
    lastName: string,
    firstName: string,
    location: string|undefined,
    birthDate: string,
    avatar: string|undefined,
    username: string
}