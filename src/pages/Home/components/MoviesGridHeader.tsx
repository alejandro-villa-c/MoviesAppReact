import { SelectItem } from "primereact/api";
import { DropdownChangeParams } from "primereact/dropdown";
import { MultiSelectChangeParams } from "primereact/multiselect";
import { RatingChangeParams } from "primereact/rating";
import { useState } from "react";
import { MoviesFilter } from "../../../models";
import { defaultMoviesFilter } from "../../../redux/movies/movies-filter-slice";
import { Button, Dropdown, Rating, MultiSelect } from '../../../components/primereact';

export const MoviesGridHeader = (
    moviesFilter: MoviesFilter,
    genresOptions: SelectItem[],
    sortOptions: SelectItem[],
    onChangeFilter: (moviesFilter: MoviesFilter) => void
) => {
    const [sortOption, setSortOption] = useState(moviesFilter.sort_by);
    const [rating, setRating] = useState(moviesFilter.vote_average);
    const [genres, setGenres] = useState(moviesFilter.with_genres.map(x => x.id));

    const resetFilters = () => {
        onChangeFilter({ ...defaultMoviesFilter });
        setSortOption(defaultMoviesFilter.sort_by);
        setRating(defaultMoviesFilter.vote_average);
        setGenres(defaultMoviesFilter.with_genres.map(x => x.id));
    };

    const handleSortOptionChange = (e: DropdownChangeParams) => {
        const selectedSortOption = e.value;
        setSortOption(selectedSortOption);
        const moviesFilterClone = { ...moviesFilter };
        moviesFilterClone.sort_by = selectedSortOption;
        onChangeFilter(moviesFilterClone);
    };

    const handleRatingChange = (e: RatingChangeParams) => {
        const selectedRating = e.value;
        setRating(selectedRating);
        const moviesFilterClone = { ...moviesFilter };
        moviesFilterClone.vote_average = selectedRating;
        onChangeFilter(moviesFilterClone);
    };

    const handleGenresChange = (e: MultiSelectChangeParams) => {
        const selectedGenres: number[] = e.value;
        setGenres(selectedGenres);
        const moviesFilterClone = { ...moviesFilter };
        moviesFilterClone.with_genres = [...genresOptions]
            .filter(x => selectedGenres.includes(x.value))
            .map(x => ({ id: x.value, name: x.label }));
        onChangeFilter(moviesFilterClone);
    };

    return (
        <div className="p-grid">
            <div className="p-lg-3 p-sm-12 p-my-auto">
                <p className="p-mb-2">Ordenar por:</p>
                <Dropdown
                    value={ sortOption }
                    options={ sortOptions }
                    onChange={ (e) => handleSortOptionChange(e) }
                    placeholder={ "Ordenar por" }
                />
            </div>
            <div className="p-lg-3 p-sm-12 p-my-auto">
                <p className="p-mb-2">Calificación menor a:</p>
                <Rating
                    value={ rating }
                    onChange={ (e) => handleRatingChange(e) }
                    stars={ 10 }
                    cancel={ false }
                />
            </div>
            <div className="p-lg-3 p-sm-12 p-my-auto">
                <p className="p-mb-2">Géneros:</p>
                <MultiSelect
                    value={ genres }
                    options={ genresOptions }
                    onChange={ (e) => handleGenresChange(e) }
                    placeholder={ "Filtrar por géneros" }
                    filter
                    selectedItemsLabel={ "{0} géneros seleccionados" }
                />
            </div>
            <div className="p-lg-3 p-sm-12 p-my-auto">
                <Button
                    className="p-ml-auto"
                    label="Reiniciar filtros"
                    onClick={ () => resetFilters() }
                />
            </div>
        </div>
    );
};

export default MoviesGridHeader;