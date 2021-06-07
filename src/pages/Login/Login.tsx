import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { InputText, Button } from '../../components/primereact/index';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
    getAccountDetailsAsync,
    getRequestTokenAsync,
    getSessionIdAsync,
    selectAccountResponse,
    setRequestToken,
    setSessionId,
    validateLoginAsync
} from '../../redux/login/login-slice';
import {
    useGetAccountDetails,
    useGetRequestToken,
    useGetSessionId,
    useValidateLogin
} from '../../services/authentication-service';
import { useGetFavoriteMovies } from '../../services/movies-service';
import { getFavoriteMoviesAsync } from '../../redux/movies/movies-slice';
import useMountEffect from '../../utils/use-mount-effect';

export const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useAppDispatch();
    const getRequestToken = useGetRequestToken();
    const validateLogin = useValidateLogin();
    const getSessionId = useGetSessionId();
    const getAccountDetails = useGetAccountDetails();
    const getFavoriteMovies = useGetFavoriteMovies();
    const history = useHistory();
    const accountResponse = useAppSelector(selectAccountResponse);

    useMountEffect(() => {
        if (!!accountResponse) {
            history.push('/');
        }
    });

    const login = (username: string, password: string) => {
        dispatch(getRequestTokenAsync(getRequestToken)).then(() => {
            dispatch(validateLoginAsync(username, password, validateLogin)).then(() => {
                dispatch(getSessionIdAsync(getSessionId)).then(() => {
                    dispatch(getAccountDetailsAsync(getAccountDetails)).then(() => {
                        dispatch(getFavoriteMoviesAsync(getFavoriteMovies)).then(() => {
                            history.push('/');
                        });
                    });
                }).catch(() => {
                    dispatch(setSessionId(null));
                });
            }).catch(() => {
                dispatch(setRequestToken(null));
            });
        });
    };

    return (
        <div className="p-grid">
            <div className="p-col-8 p-mx-auto">
                <h1 className="p-mb-3">Inicio de sesión</h1>
                <p className="p-mb-5">
                    Debes iniciar sesión con tu cuenta de <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">https://www.themoviedb.org/</a>. Si no posees una cuenta puedes crear una en el siguiente enlace: <a href="https://www.themoviedb.org/signup" target="_blank" rel="noreferrer">https://www.themoviedb.org/signup</a>.
                </p>
                <div className="p-grid">
                    <div className="p-col-12 p-mb-3">
                        <span className="p-float-label">
                            <InputText
                                id="username"
                                type="text"
                                value={ username }
                                onChange={ (e) => setUsername(e.target.value) }
                                style={ { width: '100%' } }
                            />
                            <label htmlFor="username">Usuario</label>
                        </span>
                    </div>
                    <div className="p-col-12 p-mb-3">
                        <span className="p-float-label">
                            <InputText
                                id="password"
                                type="password"
                                value={ password }
                                onChange={ (e) => setPassword(e.target.value) }
                                style={ { width: '100%' } }
                            />
                            <label htmlFor="password">Contraseña</label>
                        </span>
                    </div>
                    <div className="p-col-12">
                        <div className="p-d-flex">
                            <Button
                                className="p-mr-auto"
                                label="Iniciar sesión"
                                onClick={ () => login(username, password) }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;