import { MovieSortOptions } from "../../enums/movie-sort-options";
import { GenreResponse } from "./genre-response";

export class MoviesFilter {
    constructor(
        public id: string,
        public page: number,
        // tslint:disable-next-line: variable-name
        public sort_by: MovieSortOptions,
        // tslint:disable-next-line: variable-name
        public vote_average: number,
        // tslint:disable-next-line: variable-name
        public with_genres: GenreResponse[]
    ) {}
}