import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AccountResponse, SessionResponse, TokenResponse } from "../../services/models";
import { RootState } from '../store';

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

export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        setRequestToken: (state, action: PayloadAction<TokenResponse>) => {
            state.requestToken = action.payload?.request_token || null;
        },
        setSessionId: (state, action: PayloadAction<SessionResponse>) => {
            const sessionId = action.payload?.session_id || null;
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