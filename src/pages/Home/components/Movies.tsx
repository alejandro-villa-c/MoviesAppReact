import { SelectItem } from 'primereact/api';
import { useEffect, useState } from 'react';
import { TabView, TabPanel } from '../../../components/primereact';
import { MovieSortOptions } from '../../../enums/movie-sort-options';
import { GenreResponse, MoviesFilter } from '../../../models';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
    selectFavoriteMoviesFilter,
    selectMoviesFilter,
    setFavoriteMoviesFilter,
    setMoviesFilter
} from '../../../redux/movies/movies-filter-slice';
import {
    getGenresAsync,
    getMoviesAsync,
    selectFavoriteMovies,
    selectGenres,
    selectMovies
} from '../../../redux/movies/movies-slice';
import { applyMoviesFilters, getMoviesByPage } from '../../../services/movies-filter-service';
import { useGetGenres, useGetMovies } from '../../../services/movies-service';
import '../../../styles/Movies.css';
import useMountEffect from '../../../utils/use-mount-effect';
import MoviesGrid from './MoviesGrid';

export const Movies = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const dispatch = useAppDispatch();
    const getMovies = useGetMovies();
    const getGenres = useGetGenres();
    const moviesFilter = useAppSelector(selectMoviesFilter);
    const movies = useAppSelector(selectMovies);
    const [totalMovies, setTotalMovies] = useState(0);
    const favoriteMoviesFilter = useAppSelector(selectFavoriteMoviesFilter);
    const favoriteMovies = useAppSelector(selectFavoriteMovies);
    const [filteredFavoriteMovies, setFilteredFavoriteMovies] = useState(favoriteMovies);
    const [totalFilteredFavoriteMovies, setTotalFilteredFavoriteMovies] = useState(0);
    const genresOptions = useAppSelector(selectGenres).map((genre: GenreResponse) => {
        return {
            label: genre.name,
            value: genre.id
        };
    });
    const sortOptions: SelectItem[] = [
        {label: 'Mayor popularidad', value: MovieSortOptions.PopularityDesc},
        {label: 'Menor popularidad', value: MovieSortOptions.PopularityAsc},
        {label: 'Mejor calificadas', value: MovieSortOptions.VoteAverageDesc},
        {label: 'Peor calificadas', value: MovieSortOptions.VoteAverageAsc},
        {label: 'Alfabéticamente descendiente', value: MovieSortOptions.OriginalTitleDesc},
        {label: 'Alfabéticamente ascendiente', value: MovieSortOptions.OriginalTitleAsc},
        {label: 'Más recientes', value: MovieSortOptions.ReleaseDateDesc},
        {label: 'Más antiguas', value: MovieSortOptions.ReleaseDateAsc}
    ];
    const [isMoviesGridLoading, setIsMoviesGridLoading] = useState(false);

    useMountEffect(() => {
        handleSetMovies(moviesFilter);
        dispatch(getGenresAsync(getGenres));
    });

    useEffect(() => {
        const handleSetFavoriteMovies = (newFavoriteMoviesFilter: MoviesFilter) => {
            const newFilteredFavoriteMovies = applyMoviesFilters(
                favoriteMovies,
                newFavoriteMoviesFilter
            );
            setFilteredFavoriteMovies(
                getMoviesByPage(newFilteredFavoriteMovies, newFavoriteMoviesFilter.page)
            );
            setTotalFilteredFavoriteMovies(newFilteredFavoriteMovies.length);
        };

        handleSetFavoriteMovies(favoriteMoviesFilter);
    }, [favoriteMovies, favoriteMoviesFilter]);

    const handleChangeMoviesFilter = (newMoviesFilter: MoviesFilter) => {
        dispatch(setMoviesFilter(newMoviesFilter));
        handleSetMovies(newMoviesFilter);
    };

    const handleChangeFavoriteMoviesFilter = (newFavoriteMoviesFilter: MoviesFilter) => {
        dispatch(setFavoriteMoviesFilter(newFavoriteMoviesFilter));
    };

    const handleSetMovies = (newMoviesFilter: MoviesFilter) => {
        setIsMoviesGridLoading(true);
        dispatch(getMoviesAsync(newMoviesFilter, getMovies)).then((totalMovies: number) => {
            setTotalMovies(totalMovies);
            setIsMoviesGridLoading(false);
        });
    };

    return (
        <TabView activeIndex={ activeIndex } onTabChange={ (e) => setActiveIndex(e.index) }>
            <TabPanel header="En cartelera" rightIcon="pi pi-video">
                <MoviesGrid
                    movies={ movies }
                    totalRecords={ totalMovies }
                    moviesFilter={ moviesFilter }
                    genresOptions={ genresOptions }
                    sortOptions={ sortOptions }
                    isLoading={ isMoviesGridLoading }
                    onChangeFilter={ handleChangeMoviesFilter }
                ></MoviesGrid>
            </TabPanel>
            <TabPanel header="Favoritas" rightIcon="pi pi-star">
                <MoviesGrid
                    movies={ filteredFavoriteMovies }
                    totalRecords={ totalFilteredFavoriteMovies }
                    moviesFilter={ favoriteMoviesFilter }
                    genresOptions={ genresOptions }
                    sortOptions={ sortOptions }
                    isLoading={ false }
                    onChangeFilter={ handleChangeFavoriteMoviesFilter }
                ></MoviesGrid>
            </TabPanel>
        </TabView>
    );
}

export default Movies;