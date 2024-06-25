import { useEffect, useRef } from "react";

export default function Search({ query, setQuery }) {
    const input = useRef(null);
    useEffect(
        function () {
            function focusInput(e) {
                if (document.activeElement === input.current)
                    if (e.key === "Enter") {
                        input.current.focus();
                        setQuery("");
                    }
            }

            document.addEventListener("keydown", focusInput);

            return function () {
                document.removeEventListener("keydown", focusInput);
            };
        },
        [setQuery]
    );
    return (
        <input
            className="search"
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            ref={input}
        />
    );
}
