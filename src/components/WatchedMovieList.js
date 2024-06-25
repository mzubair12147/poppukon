import WatchedMovieItem from "./WatchedMovieItem";

export default function WatchedMovieList({ watched, onDelteWatched }) {
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
