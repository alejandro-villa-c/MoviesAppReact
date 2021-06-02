import { Menubar, Button } from './primereact';
import { Link, useHistory } from "react-router-dom";
import { useAppSelector } from '../redux/hooks';
import { selectAccountResponse, selectSessionId } from '../redux/login/login-slice';
import { useLogout } from '../services/authentication-service';
import { GenericResponse, LogoutResponse } from '../models';

const useLogoutAndNavigate = () => {
    const logout = useLogout();
    const history = useHistory();
    return (sessionId: string) => {
        logout(sessionId).then((logoutResponse: GenericResponse<LogoutResponse>) => {
            if (logoutResponse.success) {
                history.push('/login');
            }
        });
    }
}

export const Header = () => {
    const accountResponse = useAppSelector(selectAccountResponse);
    const sessionId = useAppSelector(selectSessionId);
    const logoutAndNavigate = useLogoutAndNavigate();

    const start = <Link to={{ pathname: '/' }} className="no-style">
        <h1 style={{ cursor: 'pointer', outline: 'none' }}>
            Movies App
        </h1>
    </Link>;

    let end: JSX.Element = null;
    if (!!accountResponse) {
        end = <div className="p-d-flex">
            <p className="p-d-inline-block p-my-auto p-mr-3">
                { accountResponse.name || accountResponse.username }
            </p>
            <Button
                icon="pi pi-sign-out"
                className="p-button-danger"
                onClick={ () => logoutAndNavigate(sessionId) }
                title="Cerrar sesión"
            />
        </div>;
    }

    return (
        <Menubar start={start} end={end} />
    );
};

export default Header;