import { useEffect, useState } from "react";

const API_KEY = process.env.REACT_APP_API_KEY;

export function useMovies(query, callBack) {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    useEffect(
        function () {
            const controller = new AbortController();

            if (query.length < 3) {
                setMovies([]);
                setError("");
                return;
            }
            callBack?.();
            (async function () {
                try {
                    setLoading(true);
                    setError("");
                    const response = await fetch(
                        `http://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`,
                        { signal: controller.signal }
                    );

                    if (!response.ok) {
                        throw Error(
                            "Something is wrong. the response was not received"
                        );
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

    return [movies, loading, error];
}
