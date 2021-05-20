import { Route, Redirect } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';
import { selectAccountResponse } from '../redux/login/loginSlice';

export const PrivateRoute = ({ children, ...rest }: { children: any, [x: string]: any }) => {
    const accountResponse = useAppSelector(selectAccountResponse);

    return (
        <Route
            { ...rest }
            render={({ location }) =>
                !!accountResponse ?
                (
                    children
                ) :
                (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: location }
                        }}
                    />
                )
            }
        />
    );
};

export default PrivateRoute;