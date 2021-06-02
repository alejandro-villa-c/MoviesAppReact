import { useState } from 'react';
import { DataView } from '../../../components/primereact';
import { SelectItem } from 'primereact/components/selectitem/SelectItem';
import { MovieResponse, MoviesFilter } from '../../../models';
import { perPage } from '../../../config/movies-config';
import MoviesGridHeader from './MoviesGridHeader';
import MoviesGridItem from './MoviesGridItem';

export const MoviesGrid = ({
    movies,
    totalRecords,
    moviesFilter,
    genresOptions,
    sortOptions,
    isLoading,
    onChangeFilter
}: {
    movies: MovieResponse[],
    totalRecords: number,
    moviesFilter: MoviesFilter,
    genresOptions: SelectItem[],
    sortOptions: SelectItem[],
    isLoading: boolean,
    onChangeFilter: (moviesFilter: MoviesFilter) => void
}) => {
    const [first, setFirst] = useState(0);
    const header = MoviesGridHeader(
        moviesFilter,
        genresOptions,
        sortOptions,
        onChangeFilter
    );
    const item = MoviesGridItem();

    const onChangePage = (event: any) => {
        const startIndex = event.first;
        setFirst(startIndex);
        const page: number = (startIndex / perPage) + 1;
        const moviesFilterClone = { ...moviesFilter };
        moviesFilterClone.page = page;
        onChangeFilter(moviesFilterClone);
    };

    return (
        <DataView
            value={ movies }
            layout={ 'grid' }
            header={ header }
            itemTemplate={ item }
            lazy
            paginator
            rows={ perPage }
            totalRecords={ totalRecords }
            first={ first }
            onPage={ onChangePage }
            loading={ isLoading }
            emptyMessage={ 'No hay películas en cartelera' }
        />
    );
}

export default MoviesGrid;