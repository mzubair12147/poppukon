const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function WatchedSummary({ watched }) {
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
