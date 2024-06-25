import { useEffect, useRef, useState } from "react";
import Loader from "./Loader";
import StarRating from "./StarRating";
import { useKey } from "../hook/useKey";

const API_KEY = process.env.REACT_APP_API_KEY;

export default function MovieDetails({
    selected,
    onCloseMovie,
    onAddWathched,
    watched,
}) {
    const [movieData, setMovieData] = useState({});
    const [loading, setLoading] = useState(false);
    const [userRating, setUserRating] = useState("");

    const isWatched = watched.map((movie) => movie.imdbID).includes(selected);

    const userWatchedRating = watched.find(
        (movie) => movie.imdbID === selected
    )?.userRating;

    const countRating = useRef([]);

    useEffect(
        function () {
            if (userRating) {
                countRating.current.push(userRating);
            }
        },
        [userRating]
    );

    const {
        Title: title,
        Year: year,
        Poster: poster,
        Runtime: runtime,
        imdbRating,
        Released: released,
        Actors: actors,
        Director: director,
        Genre: genre,
        Plot: plot,
    } = movieData;

    function handleAddMovie() {
        const newWatchedMovie = {
            userRating: Number(userRating),
            imdbID: selected,
            title,
            imdbRating: Number.parseInt(imdbRating),
            poster,
            released,
            runtime: Number(runtime.split(" ").at(0)),
            actors,
            director,
            genre,
            plot,
            year,
            ratingDecisions: countRating.current,
        };

        onAddWathched(newWatchedMovie);
        onCloseMovie();
    }

    useEffect(
        function () {
            (async function () {
                try {
                    setLoading(true);
                    const response = await fetch(
                        `http://www.omdbapi.com/?apikey=${API_KEY}&i=${selected}`
                    );

                    if (!response.ok) {
                        throw Error(
                            "Something is wrong. the response was not received"
                        );
                    }

                    const data = await response.json();

                    if (data.Response === "False")
                        throw Error("Requested Movie is not found");

                    setMovieData(data);
                } catch (error) {
                    console.error(error.message);
                } finally {
                    setLoading(false);
                }
            })();
        },
        [selected]
    );

    //custom hook
    useKey("Escape", onCloseMovie);

    // useEffect(
    //     function () {
    //         const closeMovie = function (e) {
    //             if (e.key === "Escape") {
    //                 onCloseMovie();
    //             }
    //         };

    //         document.addEventListener("keydown", closeMovie);

    //         return function () {
    //             document.removeEventListener("keydown", closeMovie);
    //             console.log("keydown event is removed");
    //         };
    //     },
    //     [onCloseMovie]
    // );

    useEffect(
        function () {
            if (!title) return;
            document.title = `Movie | ${title}`;

            return function () {
                document.title = "Poppukon";
            };
        },
        [title]
    );

    return (
        <div className="details">
            {loading ? (
                <Loader />
            ) : (
                <>
                    <header>
                        <button className="btn-back" onClick={onCloseMovie}>
                            &larr;
                        </button>
                        <img
                            src={poster}
                            alt={`Poster of the ${title} movie`}
                        />
                        <div className="details-overview">
                            <h2>{title}</h2>
                            <p>
                                {released} &bull; {runtime}
                            </p>
                            <p>{genre}</p>
                            <p>
                                <span>⭐</span>
                                {imdbRating} IMDB Rating
                            </p>
                        </div>
                    </header>
                    <section>
                        <div className="rating">
                            {!isWatched ? (
                                <>
                                    <StarRating
                                        size={35}
                                        onSetRating={setUserRating}
                                    />

                                    {userRating > 0 && (
                                        <button
                                            className="btn-add"
                                            onClick={handleAddMovie}
                                        >
                                            Add to List
                                        </button>
                                    )}
                                </>
                            ) : (
                                <p>
                                    You rated this movie {userWatchedRating} ⭐
                                </p>
                            )}
                        </div>
                        <em>{plot}</em>
                        <p>Staring: {actors}</p>
                        <p>Directed By: {director}</p>
                    </section>
                </>
            )}
        </div>
    );
}
