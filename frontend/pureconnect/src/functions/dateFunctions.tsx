import {getUsersLocale} from "./getUsersLocale";

export const getDate = (date: Date) => {
    const localizedDateString = new Date(date)
    let res: string;
    if (localizedDateString.getFullYear() === new Date().getFullYear())
        res = localizedDateString.toLocaleDateString(getUsersLocale(), { month: 'long', day: 'numeric' });
    else
        res = localizedDateString.toLocaleDateString(getUsersLocale(), { year: 'numeric', month: 'long', day: 'numeric' });

    return `${res}`
}

export const getTime = (date: Date) => {
    const localizedDateString = new Date(date)
    let res = localizedDateString.toLocaleTimeString(getUsersLocale(), { hour: '2-digit', minute: 'numeric' });
    return `${res}`
}