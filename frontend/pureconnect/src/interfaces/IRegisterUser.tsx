export interface IRegisterUser{
    email: string,
    password: string,
    lastName: string,
    firstName: string,
    location: string|null,
    birthDate: string,
    avatar: string|null
}