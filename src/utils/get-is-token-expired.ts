import { TokenResponse } from "../models";

export const getIsTokenExpired = (
    requestToken: TokenResponse
): boolean => {
    const currentDate = new Date();
    const currentUTCDate = new Date(Date.UTC(
        currentDate.getUTCFullYear(),
        currentDate.getUTCMonth(),
        currentDate.getUTCDate(),
        currentDate.getUTCHours(),
        currentDate.getUTCMinutes(),
        currentDate.getUTCSeconds(),
        currentDate.getUTCMilliseconds()
    ));
    const tokenExpirationDate = new Date(requestToken.expires_at);
    const isTokenExpired = tokenExpirationDate < currentUTCDate;
    return isTokenExpired;
};

export default getIsTokenExpired;