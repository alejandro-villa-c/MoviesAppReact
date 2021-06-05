import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    AccountResponse,
    GenericResponse,
    LoginRequestBody,
    SessionRequestBody,
    SessionResponse,
    TokenResponse
} from "../../models";
import { AppThunk, RootState } from '../store';

export interface LoginState {
    requestToken: TokenResponse,
    sessionId: string,
    accountResponse: AccountResponse
};

const initialState: LoginState = {
    requestToken: JSON.parse(atob(sessionStorage.getItem('token') || btoa('null'))) || null,
    sessionId: atob(sessionStorage.getItem('session-id')) || null,
    accountResponse: JSON.parse(atob(sessionStorage.getItem('account-details') || btoa('null'))) || null
};

export const getRequestTokenAsync = (
    getRequestToken: () => Promise<GenericResponse<TokenResponse>>
): AppThunk<Promise<void>> => {
    return async (dispatch, getState) => {
        const tokenResponse = await getRequestToken();
        if (tokenResponse.success) {
            dispatch(setRequestToken(tokenResponse.data));
            return Promise.resolve();
        } else {
            return Promise.reject();
        }
    };
}

export const validateLoginAsync = (
    username: string,
    password: string,
    validateLogin: (loginRequestBody: LoginRequestBody) => Promise<GenericResponse<TokenResponse>>
): AppThunk<Promise<void>> => {
    return async (dispatch, getState) => {
        const requestToken = getState().login.requestToken.request_token;
        if (requestToken) {
            const loginRequestBody = new LoginRequestBody(username, password, requestToken);
            const validateLoginResponse = await validateLogin(loginRequestBody);
            if (validateLoginResponse.success) {
                dispatch(setRequestToken(validateLoginResponse.data));
                return Promise.resolve();
            } else {
                return Promise.reject();
            }
        } else {
            return Promise.reject();
        }
    };
}

export const getSessionIdAsync = (
    getSessionId: (sessionRequestBody: SessionRequestBody) => Promise<GenericResponse<SessionResponse>>
): AppThunk<Promise<void>> => {
    return async (dispatch, getState) => {
        const requestToken = getState().login.requestToken.request_token;
        if (requestToken) {
            const sessionRequestBody: SessionRequestBody = new SessionRequestBody(
                requestToken
            );
            const sessionResponse = await getSessionId(sessionRequestBody);
            if (sessionResponse.success) {
                dispatch(setSessionId(sessionResponse.data.session_id));
                return Promise.resolve();
            } else {
                return Promise.reject();
            }
        } else {
            return Promise.reject();
        }
    };
}

export const getAccountDetailsAsync = (
    getAccountDetails: (sessionId: string) => Promise<GenericResponse<AccountResponse>>
): AppThunk<Promise<void>> => {
    return async (dispatch, getState) => {
        const sessionId = getState().login.sessionId;
        if (sessionId) {
            const accountResponse = await getAccountDetails(sessionId);
            if (accountResponse.success) {
                dispatch(setAccountResponse(accountResponse.data));
                return Promise.resolve();
            } else {
                return Promise.reject();
            }
        } else {
            return Promise.reject();
        }
    };
}

export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        setRequestToken: (state, action: PayloadAction<TokenResponse>) => {
            const tokenResponse = action.payload;
            sessionStorage.setItem('token', btoa(JSON.stringify(tokenResponse)));
            state.requestToken = tokenResponse;
        },
        setSessionId: (state, action: PayloadAction<string>) => {
            const sessionId = action.payload;
            sessionStorage.setItem('session-id', btoa(sessionId));
            state.sessionId = sessionId;
        },
        setAccountResponse: (state, action: PayloadAction<AccountResponse>) => {
            const accountResponse = action.payload;
            sessionStorage.setItem('account-details', btoa(JSON.stringify(accountResponse)));
            state.accountResponse = accountResponse;
        }
    }
});

export const { setRequestToken, setSessionId, setAccountResponse } = loginSlice.actions;

export const selectRequestToken = (state: RootState) => state.login.requestToken;
export const selectSessionId = (state: RootState) => state.login.sessionId;
export const selectAccountResponse = (state: RootState) => state.login.accountResponse;

export default loginSlice.reducer;