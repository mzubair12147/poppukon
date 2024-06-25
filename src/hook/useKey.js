import { useEffect } from "react";

export function useKey(key, callBack) {
    useEffect(
        function () {
            const closeMovie = function (e) {
                if (e.key.toLowerCase() === key.toLowerCase()) {
                    callBack?.();
                }
            };

            document.addEventListener("keydown", closeMovie);

            return function () {
                document.removeEventListener("keydown", closeMovie);
                console.log("keydown event is removed");
            };
        },
        [callBack, key]
    );
}
