import { configureStore, ThunkAction, Action, getDefaultMiddleware } from '@reduxjs/toolkit';
import loginReducer from './login/loginSlice';
import toastReducer from './toast/toastSlice';

export const store = configureStore({
    reducer: {
        login: loginReducer,
        toast: toastReducer
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