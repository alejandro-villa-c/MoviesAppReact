import { Switch, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Login from '../pages/Login/Login';
import Home from '../pages/Home/Home';

export const RouterConfig = () => {
    return (
        <Switch>
            <Route path="/login">
                <Login />
            </Route>
            <PrivateRoute exact path="/">
                <Home />
            </PrivateRoute>
        </Switch>
    );
};

export default RouterConfig;