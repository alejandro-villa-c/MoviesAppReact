import defaultPoster from '../../assets/default-poster.jpg';
import { Card, Button } from '../../components/primereact';
import FavoriteMovieMarker from '../../components/FavoriteMovieMarker';
import { formatIsoDateAsShortDate } from '../../utils/dates';
import { useHistory, useParams } from 'react-router-dom';
import { useAppSelector } from '../../redux/hooks';
import { selectFavoriteMovies, selectGenres, selectMovies } from '../../redux/movies/movies-slice';
import { useGetMovie } from '../../services/movies-service';
import useMountEffect from '../../utils/use-mount-effect';
import { useEffect, useState } from 'react';

export const Movie = () => {
    const { id } = useParams<{ id: string }>();
    const movies = useAppSelector(selectMovies);
    const favoriteMovies = useAppSelector(selectFavoriteMovies);
    const genres = useAppSelector(selectGenres);
    const getMovie = useGetMovie();
    const history = useHistory();
    const [movie, setMovie] = useState(movies.find(x => String(x.id) === id));
    const [genresFormatted, setGenresFormatted] = useState('');

    useMountEffect(() => {
        if (!movie) {
            getMovie(Number(id)).then((movieDetailResponse) => {
                const movieDetail = movieDetailResponse.data;
                setGenresFormatted(movieDetail.genres.map(x => x.name).join(', '));
                setMovie({
                    ...movieDetail,
                    isFavorite: false
                });
            });
        } else {
            setGenresFormatted(
                genres.filter(x => movie.genre_ids.includes(x.id)).map(x => x.name).join(', ')
            );
        }
    });

    useEffect(() => {
        setMovie(m => {
            if (m) {
                return {
                    ...m,
                    isFavorite: favoriteMovies.map(x => x.id).includes(m.id)
                };
            }
            return null;
        });
    }, [favoriteMovies]);

    if (movie) {
        const goBack = () => {
            history.goBack();
        };
    
        return (
            <div className="p-grid p-mb-6">
                <div className="p-lg-4 p-md-6 p-sm-12">
                    <img
                        onError={ (e) => (e.target as any).src = defaultPoster }
                        src={ `https://image.tmdb.org/t/p/w500${movie.poster_path}` }
                        alt="Movie poster not yet available"
                        style={ { width: '100%', borderRadius: '8px' } }
                    />
                </div>
                <div className="p-lg-7 p-md-6 p-sm-12">
                    <Card style={ { height: '100%' } } className="p-card-shadow">
                        <div className="p-mb-3 p-d-flex">
                            <h1>{ movie.original_title }</h1>
                            <div className="p-ml-auto">
                                <FavoriteMovieMarker
                                    movie={ movie }
                                ></FavoriteMovieMarker>
                            </div>
                        </div>
                        <div className="p-mb-3">
                            <h3 className="p-mb-2">Calificación</h3>
                            <p className="p-text-justify">
                                { movie.vote_average }/10
                            </p>
                        </div>
                        <div className="p-mb-3">
                            <h3 className="p-mb-2">Géneros</h3>
                            <p className="p-text-justify">
                                { genresFormatted }
                            </p>
                        </div>
                        <div className="p-mb-3">
                            <h3 className="p-mb-2">Sinopsis</h3>
                            <p className="p-text-justify">
                                { movie.overview }
                            </p>
                        </div>
                        <div className="p-mb-3">
                            <h3 className="p-mb-2">Estreno</h3>
                            <p className="p-text-justify">
                                { formatIsoDateAsShortDate(movie.release_date) }
                            </p>
                        </div>
                        <Button
                            label="Volver"
                            onClick={ () => goBack() }
                        ></Button>
                    </Card>
                </div>
            </div>
        );
    }
    return <></>;
};

export default Movie;