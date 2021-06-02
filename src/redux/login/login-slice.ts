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
    requestToken: string,
    sessionId: string,
    accountResponse: AccountResponse
};

const initialState: LoginState = {
    requestToken: null,
    sessionId: atob(sessionStorage.getItem('session-id')) || null,
    accountResponse: JSON.parse(atob(sessionStorage.getItem('account-details') || btoa('null'))) || null
};

export const getRequestTokenAsync = (
    getRequestToken: () => Promise<GenericResponse<TokenResponse>>
): AppThunk<Promise<void>> => {
    return async (dispatch, getState) => {
        const tokenResponse = await getRequestToken();
        if (tokenResponse.success) {
            dispatch(setRequestToken(tokenResponse.data.request_token));
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
        const loginRequestBody = new LoginRequestBody(username, password, getState().login.requestToken);
        const validateLoginResponse = await validateLogin(loginRequestBody);
        if (validateLoginResponse.success) {
            dispatch(setRequestToken(validateLoginResponse.data.request_token));
            return Promise.resolve();
        } else {
            return Promise.reject();
        }
    };
}

export const getSessionIdAsync = (
    getSessionId: (sessionRequestBody: SessionRequestBody) => Promise<GenericResponse<SessionResponse>>
): AppThunk<Promise<void>> => {
    return async (dispatch, getState) => {
        const sessionRequestBody: SessionRequestBody = new SessionRequestBody(
            getState().login.requestToken
        );
        const sessionResponse = await getSessionId(sessionRequestBody);
        if (sessionResponse.success) {
            dispatch(setSessionId(sessionResponse.data.session_id));
            return Promise.resolve();
        } else {
            return Promise.reject();
        }
    };
}

export const getAccountDetailsAsync = (
    getAccountDetails: (sessionId: string) => Promise<GenericResponse<AccountResponse>>
): AppThunk<Promise<void>> => {
    return async (dispatch, getState) => {
        const accountResponse = await getAccountDetails(getState().login.sessionId);
        if (accountResponse.success) {
            dispatch(setAccountResponse(accountResponse.data));
            return Promise.resolve();
        } else {
            return Promise.reject();
        }
    };
}

export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        setRequestToken: (state, action: PayloadAction<string>) => {
            state.requestToken = action.payload;
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