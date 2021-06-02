import { MovieResponse } from "./movie-response";

export interface MoviesResponse {
    page: number;
    // tslint:disable-next-line: variable-name
    total_results: number;
    // tslint:disable-next-line: variable-name
    total_pages: number;
    results: MovieResponse[];
}
