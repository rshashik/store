type Listener<T> = (state: T) => void;

type Store<T> = {
  getState: () => T;
  setState: (updater: T | ((prevState: T) => T), forceUpdate?: boolean) => void;
  subscribe: (listener: Listener<T>, once?: boolean) => () => void;
  reset: () => void;
};

export function createStore<T>(initialState: T | (() => T)): Store<T> {
  let state =
    typeof initialState === "function"
      ? (initialState as () => T)()
      : initialState;
  const listeners = new Map<Listener<T>, boolean>();
  let scheduled = false;
  let updateQueue: ((prevState: T) => T)[] = [];

  const getState = () => state;

  const processState = () => {
    if (updateQueue.length > 0) {
      state = updateQueue.reduce(
        (prevState, updater) => updater(prevState),
        state
      );
      updateQueue = [];
      listeners.forEach((once, listener) => {
        listener(state);
        if (once) listeners.delete(listener);
      });
    }
    scheduled = false;
  };

  const setState = (
    updater: T | ((prevState: T) => T),
    forceUpdate = false
  ) => {
    updateQueue.push(
      typeof updater === "function"
        ? (updater as (prev: T) => T)
        : () => updater
    );
    if (!scheduled || forceUpdate) {
      scheduled = true;
      Promise.resolve().then(processState);
    }
  };

  const subscribe = (listener: Listener<T>, once = false) => {
    listeners.set(listener, once);
    return () => listeners.delete(listener);
  };

  const reset = () => {
    state =
      typeof initialState === "function"
        ? (initialState as () => T)()
        : initialState;
    listeners.forEach((_, listener) => listener(state));
  };

  return { getState, setState, subscribe, reset };
}
