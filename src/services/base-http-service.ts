import { useAppDispatch } from "../redux/hooks";
import { displayErrorToast } from "../redux/toast/toast-slice";
import { GenericResponse } from "../models/index";

const useRequest = <T, K>(): (
    requestPath: string,
    method: string,
    headers: {},
    payload: K
) => Promise<GenericResponse<T>> => {
    const dispatch = useAppDispatch();
    return async (
        requestPath: string,
        method: string,
        headers: {},
        payload: K
    ) => {
        const baseUrl: string = process.env.REACT_APP_BASE_URL || '';
        const authorizationToken: string = process.env.REACT_APP_AUTHORIZATION_TOKEN || '';
        const body = payload ? JSON.stringify(payload) : null;
        return new Promise<GenericResponse<T>>((resolve) => {
            fetch(`${baseUrl}/${requestPath}`, {
                method,
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authorizationToken}`,
                ...headers
                },
                body
            })
                .then(async (res: Response) => {
                    if (!res.ok) {
                        throw JSON.stringify(await res.json());
                    }
                    return res.json();
                })
                .then((result) => {
                    resolve(new GenericResponse(result, true, null));
                }, (error) => {
                    const errorMessage = JSON.parse(error).status_message;
                    dispatch(displayErrorToast(errorMessage));
                    resolve(new GenericResponse(null, false, errorMessage));
                }).catch((error) => {
                    const errorMessage = JSON.parse(error).status_message;
                    dispatch(displayErrorToast(errorMessage));
                    resolve(new GenericResponse(null, false, errorMessage));
                });
        });
    }
};

export const useGet = <T>(): (
    requestPath: string, headers?: {}
) => Promise<GenericResponse<T>> => {
    const request = useRequest<T, null>();
    return async (requestPath: string, headers: {} = {}) => {
        return await request(requestPath, 'GET', headers, null);
    }
};

export const usePost = <T, K>(): (
    requestPath: string, payload: K, headers?: {}
) => Promise<GenericResponse<T>> => {
    const request = useRequest<T, K>();
    return async (requestPath: string, payload: K, headers: {} = {}) => {
        return await request(requestPath, 'POST', headers, payload);
    }
};

export const usePut = <T, K>(): (
    requestPath: string, payload: K, headers?: {}
) => Promise<GenericResponse<T>> => {
    const request = useRequest<T, K>();
    return async (requestPath: string, payload: K, headers: {} = {}) => {
        return await request(requestPath, 'PUT', headers, payload);
    }
};

export const useDelete = <T>(): (
    requestPath: string, headers?: {}
) => Promise<GenericResponse<T>> => {
    const request = useRequest<T, null>();
    return async (requestPath: string, headers: {} = {}) => {
        return await request(requestPath, 'DELETE', headers, null);
    }
};
