import { perPage } from "../config/movies-config";
import { MovieSortOptions } from "../enums/movie-sort-options";
import { GenreResponse, Movie, MoviesFilter } from "../models";

export const applyMoviesFilters = (movies: Movie[], moviesFilter: MoviesFilter): Movie[] => {
    let moviesClone = [...movies];
    moviesClone = sortMovies(moviesClone, moviesFilter.sort_by);
    moviesClone = filterMoviesByRatingLessThan(moviesClone, moviesFilter.vote_average);
    moviesClone = filterMoviesByGenresContained(moviesClone, moviesFilter.with_genres);
    return moviesClone;
}

export const getMoviesByPage = (movies: Movie[], page: number): Movie[] => {
    const moviesClone = [...movies];
    const fromRecord: number = ((perPage * page) - perPage);
    const toRecord: number = (perPage * page);
    return moviesClone.slice(fromRecord, toRecord);
}

export const sortByPopularityDescending = (movies: Movie[]): Movie[] => {
    return movies.sort((a, b) => b.popularity - a.popularity);
}

export const sortByPopularityAscending = (movies: Movie[]): Movie[] => {
    return movies.sort((a, b) => a.popularity - b.popularity);
}

export const sortByVoteAverageDescending = (movies: Movie[]): Movie[] => {
    return movies.sort((a, b) => b.vote_average - a.vote_average);
}

export const sortByVoteAverageAscending = (movies: Movie[]): Movie[] => {
    return movies.sort((a, b) => a.vote_average - b.vote_average);
}

export const sortByOriginalTitleDescending = (movies: Movie[]): Movie[] => {
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

export const sortByOriginalTitleAscending = (movies: Movie[]): Movie[] => {
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

export const sortByReleaseDateDescending = (movies: Movie[]): Movie[] => {
    return movies.sort((a, b) => Number(b.release_date.replace(/-/g, '')) - Number(a.release_date.replace(/-/g, '')));
}

export const sortByReleaseDateAscending = (movies: Movie[]): Movie[] => {
    return movies.sort((a, b) => Number(a.release_date.replace(/-/g, '')) - Number(b.release_date.replace(/-/g, '')));
}

export const sortMovies = (movies: Movie[], sortBy: MovieSortOptions): Movie[] => {
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

export const filterMoviesByGenresContained = (movies: Movie[], genres: GenreResponse[]): Movie[] => {
    if (genres && genres.length > 0) {
        return movies.filter((movie: Movie) => genres.every(x => movie.genre_ids.includes(x.id)));
    } else {
        return movies;
    }
}

export const filterMoviesByRatingLessThan = (movies: Movie[], voteAverage: number): Movie[] => {
    return movies.filter((movie: Movie) => movie.vote_average <= voteAverage);
}
