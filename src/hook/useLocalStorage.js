import { useEffect, useState } from "react";

export function useLocalStorage(initialState, key) {
    const [value, setValue] = useState(function () {
        if (!localStorage.getItem(key)) return initialState;
        return JSON.parse(localStorage.getItem(key));
    });

    useEffect(
        function () {
            localStorage.setItem(key, JSON.stringify(value));
        },
        [value, key]
    );

    return [value, setValue];
}
