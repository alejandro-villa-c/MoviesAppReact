import { useHistory } from 'react-router-dom';
import RouterConfig from './navigation/RouterConfig';
import './App.css';
import PrimeReact from 'primereact/api';
import { Toast } from 'primereact/toast';
import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { setToast } from './redux/toast/toast-slice';
import Header from './components/Header';
import useMountEffect from './utils/use-mount-effect';
import { selectIsTokenExpired, selectSessionId } from './redux/login/login-slice';
import { useLogout } from './services/authentication-service';

PrimeReact.ripple = true;

export const App = () => {
    const toast = useRef(null);
    const dispatch = useAppDispatch();
    const isTokenExpired = useAppSelector(selectIsTokenExpired);
    const sessionId = useAppSelector(selectSessionId);
    const logout = useLogout();
    const history = useHistory();

    useMountEffect(() => {
        dispatch(setToast(toast));
    });

    useEffect(() => {
        if (sessionId && isTokenExpired) {
            logout(sessionId).then(() => {
                history.push('/login');
            });
        }
    }, [isTokenExpired, history, logout, sessionId]);

    return (
        <div className="p-d-flex p-flex-column">
            <Header></Header>
            <div className="p-mx-auto p-mt-5" style={{ width: '85%' }}>
                <RouterConfig></RouterConfig>
                <Toast ref={toast} />
            </div>
        </div>
    );
}

export default App;
