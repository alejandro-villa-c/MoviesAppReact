import { configureStore, ThunkAction, Action, getDefaultMiddleware } from '@reduxjs/toolkit';
import loginReducer from './login/login-slice';
import toastReducer from './toast/toast-slice';
import moviesReducer from './movies/movies-slice';
import moviesFilterReducer from './movies/movies-filter-slice';

export const store = configureStore({
    reducer: {
        login: loginReducer,
        toast: toastReducer,
        movies: moviesReducer,
        moviesFilter: moviesFilterReducer
    },
    middleware: getDefaultMiddleware({
        serializableCheck: {
            ignoredActionPaths: ['payload.current'],
            ignoredPaths: ['toast.toast.current']
        }
    })
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;