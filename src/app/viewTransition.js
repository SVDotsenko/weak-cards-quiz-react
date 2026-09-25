import { flushSync } from "react-dom";

const activeTransitions = new WeakMap();

export function startViewTransition(update, elements) {
    if (
        typeof document === "undefined" ||
        typeof document.startViewTransition !== "function"
    ) {
        update();
        return;
    }

    const snapshots = elements
        .filter(({ element }) => element)
        .map(({ element, name }) => {
            const token = {};
            const previousName = element.style.viewTransitionName;

            activeTransitions.set(element, token);
            element.style.viewTransitionName = name;

            return { element, previousName, token };
        });

    const cleanup = () => {
        snapshots.forEach(({ element, previousName, token }) => {
            if (activeTransitions.get(element) !== token) {
                return;
            }

            element.style.viewTransitionName = previousName;
            activeTransitions.delete(element);
        });
    };

    try {
        document
            .startViewTransition(() => flushSync(update))
            .finished.then(cleanup, cleanup);
    } catch {
        cleanup();
        update();
    }
}