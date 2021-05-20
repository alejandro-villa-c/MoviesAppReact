import { useState } from 'react';
import { useHistory } from 'react-router';
import { InputText, Button } from '../../components/primereact/index';
import { useAppDispatch } from '../../redux/hooks';
import { setAccountResponse, setRequestToken, setSessionId } from '../../redux/login/loginSlice';
import { useGetAccountDetails, useGetRequestToken, useGetSessionId, useValidateLogin } from '../../services/authentication-service';
import { AccountResponse, GenericResponse, LoginRequestBody, SessionRequestBody, SessionResponse, TokenResponse } from '../../services/models';

const useLogin = () => {
    const dispatch = useAppDispatch();
    const getRequestToken = useGetRequestToken();
    const validateLogin = useValidateLogin();
    const getSessionId = useGetSessionId();
    const getAccountDetails = useGetAccountDetails();
    const history = useHistory();
    return (username: string, password: string) => {
        getRequestToken().then((tokenResponse: GenericResponse<TokenResponse>) => {
            if (tokenResponse.success) {
                const requestToken = tokenResponse.data;
                dispatch(setRequestToken(requestToken));
                const loginRequestBody = new LoginRequestBody(username, password, requestToken.request_token);
                validateLogin(loginRequestBody).then((validateLoginResponse: GenericResponse<TokenResponse>) => {
                    if (validateLoginResponse.success) {
                        const validatedRequestToken = validateLoginResponse.data;
                        dispatch(setRequestToken(validatedRequestToken));
                        const sessionRequestBody: SessionRequestBody = new SessionRequestBody(validatedRequestToken.request_token);
                        getSessionId(sessionRequestBody).then((sessionResponse: GenericResponse<SessionResponse>) => {
                            if (sessionResponse.success) {
                                const session = sessionResponse.data;
                                dispatch(setSessionId(session));
                                getAccountDetails(session.session_id).then((accountResponse: GenericResponse<AccountResponse>) => {
                                    if (accountResponse.success) {
                                        const account = accountResponse.data;
                                        dispatch(setAccountResponse(account));
                                        history.push('/');
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
}

export const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const login = useLogin();

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
                            <InputText id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: '100%' }} />
                            <label htmlFor="username">Usuario</label>
                        </span>
                    </div>
                    <div className="p-col-12 p-mb-3">
                        <span className="p-float-label">
                            <InputText id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%' }} />
                            <label htmlFor="password">Contraseña</label>
                        </span>
                    </div>
                    <div className="p-col-12">
                        <div className="p-d-flex">
                            <Button className="p-mr-auto" label="Iniciar sesión" onClick={ () => login(username, password) } />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;