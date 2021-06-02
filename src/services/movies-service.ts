import { useGet, usePost } from "./base-http-service";
import { MoviesFilter, MoviesResponse, MovieResponse, MovieDetail, MarkAsFavoriteResponse, MarkAsFavoriteBody, GenresResponse } from "../models/movies";

const discoverPath = 'discover';
const moviePath = 'movie';
const accountPath = 'account';
const favoritePath = 'favorite';
const genrePath = 'genre';

export const useGetMovies = () => {
    const get = useGet<MoviesResponse>();
    return async (moviesFilter: MoviesFilter) => {
        const withGenres: string = moviesFilter.with_genres.map(x => x.id).join(',');
        return await get(
            `${discoverPath}/${moviePath}?page=${moviesFilter.page}&sort_by=${moviesFilter.sort_by}&vote_average.lte=${moviesFilter.vote_average}&with_genres=${withGenres}`
        );
    }
}

export const useGetMovie = () => {
    const get = useGet<MovieDetail>();
    return async (movieId: number) => {
        return await get(`${moviePath}/${movieId}`);
    }
}

export const useGetFavoriteMovies = () => {
    const getFavoriteMoviesByPage = useGetFavoriteMoviesByPage();
    return async (accountId: number, sessionId: string) => {
        const favoriteMoviesFirstPage: MoviesResponse = (await getFavoriteMoviesByPage(accountId, sessionId, 1)).data;
        const favoriteMovies: MovieResponse[] = [];
        favoriteMovies.push(...favoriteMoviesFirstPage.results);
        [...Array.from(Array(favoriteMoviesFirstPage.total_pages).keys())].forEach(async (page: number) => {
            if (page > 1) {
                favoriteMovies.push(
                    ...(await getFavoriteMoviesByPage(accountId, sessionId, page)).data.results
                );
            }
        });
        return favoriteMovies;
    }
}

export const useGetFavoriteMoviesByPage = () => {
    const get = useGet<MoviesResponse>();
    return async (accountId: number, sessionId: string, page: number) => {
        return await get(
            `${accountPath}/${accountId}/${favoritePath}/movies?session_id=${sessionId}&page=${page}`
        );
    }
}

export const useMarkAsFavorite = () => {
    const post = usePost<MarkAsFavoriteResponse, MarkAsFavoriteBody>();
    return async (
        accountId: number,
        sessionId: string,
        markAsFavoriteBody: MarkAsFavoriteBody
    ) => {
        return await post(
            `${accountPath}/${accountId}/${favoritePath}?session_id=${sessionId}`,
            markAsFavoriteBody
        );
    }
}

export const useGetGenres = () => {
    const get = useGet<GenresResponse>();
    return async () => {
        return await get(
            `${genrePath}/${moviePath}/list`
        );
    }
}
