import { useAppDispatch } from "../redux/hooks";
import { setAccountResponse, setRequestToken, setSessionId } from "../redux/login/login-slice";
import { useDelete, useGet, usePost } from "./base-http-service";
import {
    TokenResponse,
    LoginRequestBody,
    SessionRequestBody,
    SessionResponse,
    AccountResponse,
    LogoutResponse
} from "../models/index";

const authenticationPath = 'authentication';
const tokenPath = 'token';
const sessionPath = 'session';
const accountPath = 'account';

export const useGetRequestToken = () => {
    const get = useGet<TokenResponse>();
    return async () => {
        return await get(`${authenticationPath}/${tokenPath}/new`);
    }
}

export const useValidateLogin = () => {
    const post = usePost<TokenResponse, LoginRequestBody>();
    return async (loginRequestBody: LoginRequestBody) => {
        return await post(
            `${authenticationPath}/${tokenPath}/validate_with_login`, loginRequestBody
        );
    }
}

export const useGetSessionId = () => {
    const post = usePost<SessionResponse, SessionRequestBody>();
    return async (sessionRequestBody: SessionRequestBody) => {
        return await post(
            `${authenticationPath}/${sessionPath}/new`, sessionRequestBody
        );
    }
}

export const useGetAccountDetails = () => {
    const get = useGet<AccountResponse>();
    return async (sessionId: string) => {
        return await get(`${accountPath}?session_id=${sessionId}`);
    }
}

export const useLogout = () => {
    const httpDelete = useDelete<LogoutResponse>();
    const dispatch = useAppDispatch();
    return async (sessionId: string) => {
        dispatch(setRequestToken(null));
        dispatch(setSessionId(null));
        dispatch(setAccountResponse(null));
        return await httpDelete(
            `${authenticationPath}/${sessionPath}?session_id=${sessionId}`
        );
    }
}
