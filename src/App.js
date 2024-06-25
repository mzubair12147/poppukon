import { useState } from "react";
import "./index.css";
import Loader from "./components/Loader";
import ErrorMessage from "./components/ErrorMessage";
import Nav from "./components/Nav";
import Search from "./components/Search";
import NumResults from "./components/NumResults";
import MoviesList from "./components/MoviesList";
import Main from "./components/Main";
import Box from "./components/Box";
import WatchedMovieList from "./components/WatchedMovieList";
import WatchedSummary from "./components/WatchedSummary";
import MovieDetails from "./components/MovieDetails";
import { useMovies } from "./hook/useMovies";
import { useLocalStorage } from "./hook/useLocalStorage";

export default function App() {
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState(null);

    // custom hooks
    const [watched, setWatched] = useLocalStorage([], "watched");
    const [movies, loading, error] = useMovies(query, handleCloseMovie);

    function handleSelectMovie(movieID) {
        setSelected((currID) => (movieID === currID ? null : movieID));
    }

    function handleCloseMovie() {
        setSelected(null);
    }

    function handleAddWatched(movie) {
        if (watched.find((watch) => watch?.imdbID === movie.imdbID)) {
            return;
        }
        setWatched([...watched, movie]);
    }

    function handleDeleteWatched(movieID) {
        setWatched((watched) =>
            watched.filter((movie) => movie.imdbID !== movieID)
        );
    }

    // const [watched, setWatched] = useState(function () {
    //     return JSON.parse(localStorage.getItem("watched"));
    // });

    // useEffect(
    //     function () {
    //         localStorage.setItem("watched", JSON.stringify(watched));
    //     },
    //     [watched]
    // );

    return (
        <>
            <Nav>
                <Search query={query} setQuery={setQuery} />
                <NumResults movies={movies} />
            </Nav>
            <Main>
                <Box>
                    {!error && !loading && (
                        <MoviesList
                            movies={movies}
                            onSelectMovie={handleSelectMovie}
                        />
                    )}
                    {error && <ErrorMessage message={error} />}
                    {loading && <Loader />}
                </Box>
                <Box>
                    {selected ? (
                        <MovieDetails
                            selected={selected}
                            onCloseMovie={handleCloseMovie}
                            onAddWathched={handleAddWatched}
                            watched={watched}
                        />
                    ) : (
                        <>
                            <WatchedSummary watched={watched} />
                            <WatchedMovieList
                                watched={watched}
                                onDelteWatched={handleDeleteWatched}
                            />
                        </>
                    )}
                </Box>
            </Main>

            {/* <StarRating maxStars={10} defaultRating={5} /> */}
        </>
    );
}

// function ListBox({ children }) {
//   const [isOpen1, setIsOpen1] = useState(true);
//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen1((open) => !open)}
//       >
//         {isOpen1 ? "–" : "+"}
//       </button>
//       {isOpen1 && children}
//     </div>
//   );
// }

// function WatchedBox({ children }) {
//   const [isOpen2, setIsOpen2] = useState(true);

//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen2((open) => !open)}
//       >
//         {isOpen2 ? "–" : "+"}
//       </button>
//       {isOpen2 && children}
//     </div>
//   );
// }
