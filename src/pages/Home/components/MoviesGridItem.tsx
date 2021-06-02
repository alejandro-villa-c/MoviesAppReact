import { Movie } from "../../../models";
import { Link } from 'react-router-dom';
import FavoriteMovieMarker from '../../../components/FavoriteMovieMarker';
import defaultPoster from '../../../assets/default-poster.jpg';
import { Card } from '../../../components/primereact';
import { formatIsoDateAsShortDate } from "../../../utils/dates";

export const MoviesGridItem = () => {
    return (movie: Movie) => {
        if (movie) {
            const header = <Link to={{ pathname: `/movie/${movie.id}` }} className="no-style">
                <img
                    onError={ (e) => (e.target as any).src = defaultPoster }
                    src={ `https://image.tmdb.org/t/p/w500${movie.poster_path}` }
                    alt="Movie poster not yet available"
                    style={{ cursor: 'pointer' }}
                />
            </Link>;
        
            return (
                <div className="p-md-3">
                    <Card style={ {height: '100%'} } className="p-card-shadow" header={ header }>
                        <div className="p-d-flex">
                            <Link to={{ pathname: `/movie/${movie.id}` }} className="no-style">
                                <h1
                                    className="p-card-title"
                                    style={{ cursor: 'pointer', outline: 'none' }}
                                >
                                    { movie.original_title }
                                </h1>
                            </Link>
                            <div className="p-ml-auto">
                                <FavoriteMovieMarker
                                    movie={ movie }
                                ></FavoriteMovieMarker>
                            </div>
                        </div>
                        <p className="p-card-subtitle">{ movie.vote_average }/10</p>
                        <p className="p-mb-2">{ movie.overview }</p>
                        <div className="p-d-flex">
                            <p className="p-ml-auto p-card-subtitle">
                                { formatIsoDateAsShortDate(movie.release_date) }
                            </p>
                        </div>
                    </Card>
                </div>
            );
        }
        return <></>;
    }
};

export default MoviesGridItem;