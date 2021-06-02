import { GenreResponse } from "./genre-response";

export interface NormalizedMoviesFilter {
    id: string;
    page: number;
    // tslint:disable-next-line: variable-name
    sort_by: string;
    // tslint:disable-next-line: variable-name
    vote_average: number;
    // tslint:disable-next-line: variable-name
    with_genres: string[];
}

export interface NormalizedSchemaMoviesFilter {
    result: any;
    entities: {
        moviesFilter: NormalizedMoviesFilter,
        // tslint:disable-next-line: variable-name
        with_genres: GenreResponse[]
    }
}