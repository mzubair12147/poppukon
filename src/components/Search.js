import { useRef } from "react";
import { useKey } from "../hook/useKey";

export default function Search({ query, setQuery }) {
    const input = useRef(null);
    useKey("Enter", function () {
        if (document.activeElement === input.current) return;
        input.current.focus();
        setQuery("");
    });
    // useEffect(
    //     function () {
    //         function focusInput(e) {
    //             if (e.key === "Enter") {
    //                 if (document.activeElement === input.current) {
    //                     input.current.focus();
    //                     setQuery("");
    //                 }
    //             }
    //         }

    //         document.addEventListener("keydown", focusInput);

    //         return function () {
    //             document.removeEventListener("keydown", focusInput);
    //         };
    //     },
    //     [setQuery]
    // );

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
