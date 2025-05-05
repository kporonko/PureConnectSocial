import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LocalizedStrings from "react-localization";
import { getSearchedUsers } from '../utils/FetchData';
import { ISearchedUser } from '../interfaces/IMayKnowUser';
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import SearchedUser from "./SearchedUser";

interface SearchUsersProps {
    theme: string;
    debounceTime?: number;
    onUserSelect?: (user: ISearchedUser) => void;
    tokenGetter?: () => string;
}

const SearchUsers: React.FC<SearchUsersProps> = ({
                                                     theme,
                                                     debounceTime = 1000,
                                                     onUserSelect,
                                                     tokenGetter = () => localStorage.getItem('token') || ''
                                                 }) => {
    const [searchText, setSearchText] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [users, setUsers] = useState<ISearchedUser[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showResults, setShowResults] = useState(false);

    const searchTimer = useRef<NodeJS.Timeout | null>(null);
    const nav = useNavigate();
    const componentRef = useRef<HTMLDivElement>(null);

    const strings = new LocalizedStrings({
        en: {
            search: "Search...",
            noResults: "No users found",
            errorLoading: "Error loading users",
            expired: "Your session is expired. Please log in again.",
        },
        ua: {
            search: "Пошук...",
            noResults: "Користувачів не знайдено",
            errorLoading: "Помилка завантаження користувачів",
            expired: "Ваша сесія закінчилася. Будь ласка, увійдіть знову.",
        }
    });

    // Очистка таймера при размонтировании
    useEffect(() => {
        return () => {
            if (searchTimer.current) {
                clearTimeout(searchTimer.current);
            }
        };
    }, []);

    // Обработчик изменения текста с дебаунсингом
    const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setSearchText(value);

        // Очищаем предыдущий таймер
        if (searchTimer.current) {
            clearTimeout(searchTimer.current);
        }

        // Устанавливаем новый таймер
        searchTimer.current = setTimeout(async () => {
            if (value.trim() === '') {
                setUsers([]);
                setShowResults(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);

                const token = localStorage.getItem('access_token');
                if (token !== null) {
                    const foundUsers = await getSearchedUsers(token, value);

                    if (foundUsers.status === 401) {
                        setTimeout(() => nav('/'), 2000);
                        toast.error(strings.expired);
                        return;
                    }

                    setUsers(foundUsers);
                    setShowResults(true);
                }
            } catch (err) {
                console.error('Error searching users:', err);
                setError(strings.errorLoading);
                setUsers([]);
            } finally {
                setIsLoading(false);
            }
        }, debounceTime);
    }, [debounceTime, nav, strings.errorLoading, strings.expired, tokenGetter]);

    // Закрываем результаты по клику вне компонента
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (componentRef.current && !componentRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleFocus = () => {
        setIsFocused(true);
        if (searchText.length > 0) {
            setShowResults(true);
        }
    };

    const handleBlur = () => {
        if (searchText === "") {
            setIsFocused(false);
        }
    };

    const handleUserClick = (user: ISearchedUser) => {
        if (onUserSelect) {
            onUserSelect(user);
        }
        console.log('userSelected')
        nav(`/user/${user.userId}`)
};

    return (
        <div className="search-container" ref={componentRef}>
            <div className="search-area-wrapper">
                <div className={'search-img-wrapper'}>
                    <FontAwesomeIcon className={'nav-icon-search-page'} icon={solid('search')} />
                    {isLoading && <FontAwesomeIcon className={'nav-icon-loading'} icon={solid('spinner')} spin />}
                </div>

                <div>
                    <textarea
                        className={'search-textarea'}
                        value={isFocused ? searchText : searchText || strings.search}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    />
                </div>
            </div>

            {error && <div className="search-error">{error}</div>}

            {showResults && (
                <div className={`search-results`}>
                    {users.length === 0 && !isLoading ? (
                        <div className="no-results">{strings.noResults}</div>
                    ) : (
                        <div className="user-list">
                            {users.map((user, index) => (
                                <SearchedUser user={user} key={index} handleUserClick={handleUserClick}/>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchUsers;