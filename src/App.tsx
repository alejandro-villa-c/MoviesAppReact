import { BrowserRouter as Router } from 'react-router-dom';
import RouterConfig from './navigation/RouterConfig';
import './App.css';
import PrimeReact from 'primereact/api';
import { Toast } from 'primereact/toast';
import { useEffect, useRef } from 'react';
import { useAppDispatch } from './redux/hooks';
import { setToast } from './redux/toast/toastSlice';
import Header from './components/Header';

PrimeReact.ripple = true;

export const App = () => {
    const toast = useRef(null);
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(setToast(toast));
    }, [dispatch]);

    return (
        <div className="p-d-flex p-flex-column">
            <Router>
                <Header></Header>
                <div className="p-mx-auto p-mt-5" style={{ width: '85%' }}>
                    <RouterConfig></RouterConfig>
                    <Toast ref={toast} />
                </div>
            </Router>
        </div>
    );
}

export default App;
