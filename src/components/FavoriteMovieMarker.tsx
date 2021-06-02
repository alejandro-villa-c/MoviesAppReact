import { GenericResponse, MarkAsFavoriteBody, MarkAsFavoriteResponse, Movie } from "../models";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectAccountResponse, selectSessionId } from "../redux/login/login-slice";
import { setFavoriteMovie } from "../redux/movies/movies-slice";
import { useMarkAsFavorite } from "../services/movies-service";

export const FavoriteMovieMarker = ({
    movie
}: {
    movie: Movie
}) => {
    const markAsFavorite = useMarkAsFavorite();
    const accountResponse = useAppSelector(selectAccountResponse);
    const sessionId = useAppSelector(selectSessionId);
    const dispatch = useAppDispatch();

    const handleMarkAsFavorite = (movie: Movie) => {
        markAsFavorite(
            accountResponse.id,
            sessionId,
            new MarkAsFavoriteBody(movie.id, !movie.isFavorite)
        ).then((markAsFavoriteResponse: GenericResponse<MarkAsFavoriteResponse>) => {
            if (markAsFavoriteResponse.success) {
                const movieClone = { ...movie };
                movieClone.isFavorite = !movieClone.isFavorite;
                dispatch(setFavoriteMovie(movieClone));
            }
        });
    }
    const iconClassName = movie.isFavorite ? 'pi-star' : 'pi-star-o';
    const actionLabel = movie.isFavorite ? 'Remover' : 'Agregar';

    return (
        <i
            className={ `pi ${iconClassName}` }
            onClick={ () => handleMarkAsFavorite(movie) }
            style={ { cursor: 'pointer', fontSize: '1.5rem' } }
            title={ `${actionLabel} película favorita` }
        ></i>
    );
}

export default FavoriteMovieMarker;