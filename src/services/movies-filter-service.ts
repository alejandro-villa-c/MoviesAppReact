import { perPage } from "../config/movies-config";
import { MovieSortOptions } from "../enums/movie-sort-options";
import { GenreResponse, MovieResponse, MoviesFilter } from "../models";

export const applyMoviesFilters = (movies: MovieResponse[], moviesFilter: MoviesFilter): MovieResponse[] => {
    let moviesClone: MovieResponse[] = [...movies];
    moviesClone = sortMovies(moviesClone, moviesFilter.sort_by);
    moviesClone = filterMoviesByRatingLessThan(moviesClone, moviesFilter.vote_average);
    moviesClone = filterMoviesByGenresContained(moviesClone, moviesFilter.with_genres);
    return moviesClone;
}

export const getMoviesByPage = (movies: MovieResponse[], page: number): MovieResponse[] => {
    const moviesClone = [...movies];
    const fromRecord: number = ((perPage * page) - perPage);
    const toRecord: number = (perPage * page);
    return moviesClone.slice(fromRecord, toRecord);
}

export const sortByPopularityDescending = (movies: MovieResponse[]): MovieResponse[] => {
    return movies.sort((a, b) => b.popularity - a.popularity);
}

export const sortByPopularityAscending = (movies: MovieResponse[]): MovieResponse[] => {
    return movies.sort((a, b) => a.popularity - b.popularity);
}

export const sortByVoteAverageDescending = (movies: MovieResponse[]): MovieResponse[] => {
    return movies.sort((a, b) => b.vote_average - a.vote_average);
}

export const sortByVoteAverageAscending = (movies: MovieResponse[]): MovieResponse[] => {
    return movies.sort((a, b) => a.vote_average - b.vote_average);
}

export const sortByOriginalTitleDescending = (movies: MovieResponse[]): MovieResponse[] => {
    return movies.sort((a, b) => {
        const nameA = a.original_title.toUpperCase();
        const nameB = b.original_title.toUpperCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });
}

export const sortByOriginalTitleAscending = (movies: MovieResponse[]): MovieResponse[] => {
    return movies.sort((a, b) => {
        const nameA = a.original_title.toUpperCase();
        const nameB = b.original_title.toUpperCase();
        if (nameA > nameB) {
            return -1;
        }
        if (nameA < nameB) {
            return 1;
        }
        return 0;
    });
}

export const sortByReleaseDateDescending = (movies: MovieResponse[]): MovieResponse[] => {
    return movies.sort((a, b) => Number(b.release_date.replace(/-/g, '')) - Number(a.release_date.replace(/-/g, '')));
}

export const sortByReleaseDateAscending = (movies: MovieResponse[]): MovieResponse[] => {
    return movies.sort((a, b) => Number(a.release_date.replace(/-/g, '')) - Number(b.release_date.replace(/-/g, '')));
}

export const sortMovies = (movies: MovieResponse[], sortBy: MovieSortOptions): MovieResponse[] => {
    const moviesClone = [...movies];
    switch (sortBy) {
        case MovieSortOptions.PopularityDesc:
            return sortByPopularityDescending(moviesClone);
        case MovieSortOptions.PopularityAsc:
            return sortByPopularityAscending(moviesClone);
        case MovieSortOptions.VoteAverageDesc:
            return sortByVoteAverageDescending(moviesClone);
        case MovieSortOptions.VoteAverageAsc:
            return sortByVoteAverageAscending(moviesClone);
        case MovieSortOptions.OriginalTitleDesc:
            return sortByOriginalTitleDescending(moviesClone);
        case MovieSortOptions.OriginalTitleAsc:
            return sortByOriginalTitleAscending(moviesClone);
        case MovieSortOptions.ReleaseDateDesc:
            return sortByReleaseDateDescending(moviesClone);
        case MovieSortOptions.ReleaseDateAsc:
            return sortByReleaseDateAscending(moviesClone);
        default:
            return moviesClone;
    }
}

export const filterMoviesByGenresContained = (movies: MovieResponse[], genres: GenreResponse[]): MovieResponse[] => {
    if (genres && genres.length > 0) {
        return movies.filter((movie: MovieResponse) => genres.every(x => movie.genre_ids.includes(x.id)));
    } else {
        return movies;
    }
}

export const filterMoviesByRatingLessThan = (movies: MovieResponse[], voteAverage: number): MovieResponse[] => {
    return movies.filter((movie: MovieResponse) => movie.vote_average <= voteAverage);
}
