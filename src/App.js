import { Children, useEffect, useState } from "react";
import "./index.css";
import StarRating from "./components/StarRating";
const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const API_KEY = "da5d4ab9";

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState(tempMovieData);
  const [watched, setWatched] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

  function handleSelectMovie(movieID) {
    setSelected((currID) => (movieID === currID ? null : movieID));
  }

  function handleCloseMovie(movieID) {
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

  useEffect(
    function () {
      const controller = new AbortController();

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      (async function () {
        try {
          setLoading(true);
          setError("");
          const response = await fetch(
            `http://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!response.ok) {
            throw Error("Something is wrong. the response was not received");
          }

          const data = await response.json();

          if (data.Response === "False")
            throw Error("Requested Movie is not found");

          setMovies(data.Search);
          setError("");
        } catch (error) {
          if (error.name !== "AbortError") {
            setError(error.message);
          }
        } finally {
          setLoading(false);
          // setError("");
        }
      })();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return (
    <>
      <Nav>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </Nav>
      <Main>
        <Box>
          {!error && !loading && (
            <MoviesList movies={movies} onSelectMovie={handleSelectMovie} />
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

function Loader() {
  return <p className="loader"> Loading ... </p>;
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>📛</span>
      {message}
    </p>
  );
}

function Nav({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>Poppukon</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function MoviesList({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <MovieItem
          movie={movie}
          key={movie.imdbID}
          onSelectMovie={onSelectMovie}
        />
      ))}
    </ul>
  );
}

function MovieItem({ movie, onSelectMovie }) {
  return (
    <li
      key={movie.imdbID}
      onClick={() => {
        onSelectMovie(movie.imdbID);
      }}
    >
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>
            {avgImdbRating - Number.parseInt(avgImdbRating) !== 0
              ? avgImdbRating.toFixed(2)
              : avgImdbRating}
          </span>
        </p>
        <p>
          <span>🌟</span>
          <span>
            {avgUserRating - Number.parseInt(avgUserRating) !== 0
              ? avgUserRating.toFixed(2)
              : avgUserRating}
          </span>
        </p>
        <p>
          <span>⏳</span>
          <span>
            {avgRuntime - Number.parseInt(avgRuntime) !== 0
              ? avgRuntime.toFixed(2)
              : avgRuntime}{" "}
            min
          </span>
        </p>
      </div>
    </div>
  );
}

function WatchedMovieList({ watched, onDelteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovieItem
          movie={movie}
          key={movie.imdbID}
          onDelteWatched={onDelteWatched}
        />
      ))}
    </ul>
  );
}

function WatchedMovieItem({ movie, onDelteWatched }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button
          className="btn-delete"
          onClick={() => onDelteWatched(movie.imdbID)}
        >
          X
        </button>
      </div>
    </li>
  );
}

function MovieDetails({ selected, onCloseMovie, onAddWathched, watched }) {
  const [movieData, setMovieData] = useState({});
  const [loading, setLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  const isWatched = watched.map((movie) => movie.imdbID).includes(selected);

  const userWatchedRating = watched.find(
    (movie) => movie.imdbID === selected
  )?.userRating;

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
            throw Error("Something is wrong. the response was not received");
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

  useEffect(
    function () {
      const closeMovie = function (e) {
        if (e.key === "Escape") {
          onCloseMovie();
        }
      };

      document.addEventListener("keydown", closeMovie);

      return function () {
        document.removeEventListener("keydown", closeMovie);
        console.log("keydown event is removed");
      };
    },
    [onCloseMovie]
  );

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
            <img src={poster} alt={`Poster of the ${title} movie`} />
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
                  <StarRating size={35} onSetRating={setUserRating} />

                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAddMovie}>
                      Add to List
                    </button>
                  )}
                </>
              ) : (
                <p>You rated this movie {userWatchedRating} ⭐</p>
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
