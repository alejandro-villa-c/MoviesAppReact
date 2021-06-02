import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { normalize, schema, denormalize } from "normalizr";
import { MovieSortOptions } from "../../enums/movie-sort-options";
import { GenreResponse, MoviesFilter, NormalizedMoviesFilter, NormalizedSchemaMoviesFilter } from "../../models";
import { RootState } from "../store";

export interface MoviesFilterState {
    moviesFilterResult: any;
    moviesFilter: NormalizedMoviesFilter;
    moviesFilterGenres: GenreResponse[];
    favoriteMoviesFilterResult: any;
    favoriteMoviesFilter: NormalizedMoviesFilter;
    favoriteMoviesFilterGenres: GenreResponse[];
};

const getMoviesFilterSchema = () => {
    const withGenres = new schema.Entity('with_genres');
    const moviesFilter = new schema.Entity('moviesFilter', {
        with_genres: [withGenres]
    });
    return moviesFilter;
}
export const defaultMoviesFilter: MoviesFilter = new MoviesFilter('1', 1, MovieSortOptions.PopularityDesc, 10, []);
const defaultNormalizedMoviesFilter = normalize(defaultMoviesFilter, getMoviesFilterSchema()) as NormalizedSchemaMoviesFilter;

const initialState: MoviesFilterState = {
    moviesFilterResult: defaultNormalizedMoviesFilter.result,
    moviesFilter: defaultNormalizedMoviesFilter.entities.moviesFilter,
    moviesFilterGenres: defaultNormalizedMoviesFilter.entities.with_genres,
    favoriteMoviesFilterResult: defaultNormalizedMoviesFilter.result,
    favoriteMoviesFilter: defaultNormalizedMoviesFilter.entities.moviesFilter,
    favoriteMoviesFilterGenres: defaultNormalizedMoviesFilter.entities.with_genres
};

export const moviesFilterSlice = createSlice({
    name: 'moviesFilter',
    initialState,
    reducers: {
        setMoviesFilter: (state, action: PayloadAction<MoviesFilter>) => {
            const moviesFilterClone = { ...action.payload };
            const normalizedMoviesFilter = normalize(moviesFilterClone, getMoviesFilterSchema()) as NormalizedSchemaMoviesFilter;
            state.moviesFilterResult = normalizedMoviesFilter.result;
            state.moviesFilter = normalizedMoviesFilter.entities.moviesFilter;
            state.moviesFilterGenres = normalizedMoviesFilter.entities.with_genres;
        },
        setFavoriteMoviesFilter: (state, action: PayloadAction<MoviesFilter>) => {
            const moviesFilterClone = { ...action.payload };
            const normalizedMoviesFilter = normalize(moviesFilterClone, getMoviesFilterSchema()) as NormalizedSchemaMoviesFilter;
            state.favoriteMoviesFilterResult = normalizedMoviesFilter.result;
            state.favoriteMoviesFilter = normalizedMoviesFilter.entities.moviesFilter;
            state.favoriteMoviesFilterGenres = normalizedMoviesFilter.entities.with_genres;
        }
    }
});

export const {
    setMoviesFilter,
    setFavoriteMoviesFilter
} = moviesFilterSlice.actions;

export const selectMoviesFilter = (state: RootState) => {
    const entities = {
        moviesFilter: state.moviesFilter.moviesFilter,
        with_genres: state.moviesFilter.moviesFilterGenres
    };
    return denormalize(state.moviesFilter.moviesFilterResult, getMoviesFilterSchema(), entities) as MoviesFilter;
};
export const selectFavoriteMoviesFilter = (state: RootState) => {
    const entities = {
        moviesFilter: state.moviesFilter.favoriteMoviesFilter,
        with_genres: state.moviesFilter.favoriteMoviesFilterGenres
    };
    return denormalize(state.moviesFilter.favoriteMoviesFilterResult, getMoviesFilterSchema(), entities) as MoviesFilter;
};

export default moviesFilterSlice.reducer;