import { describe, test, expect } from "vitest";
import { createStore } from "./store";

describe("createStore", () => {
  test("initial state", () => {
    const store = createStore({ count: 0 });
    expect(store.getState()).toEqual({ count: 0 });
  });

  test("state updates correctly", async () => {
    const store = createStore({ count: 0 });
    store.setState((prev) => ({ count: prev.count + 1 }));
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(store.getState()).toEqual({ count: 1 });
  });

  test("subscribers get notified", async () => {
    const store = createStore({ count: 0 });
    let updatedState;
    store.subscribe((state) => {
      updatedState = state;
    });
    store.setState({ count: 1 });
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(updatedState).toEqual({ count: 1 });
  });

  test("one-time subscriber unsubscribes after first update", async () => {
    const store = createStore({ count: 0 });
    let callCount = 0;
    store.subscribe(() => {
      callCount++;
    }, true);
    store.setState({ count: 1 });
    store.setState({ count: 2 });
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(callCount).toBe(1);
  });

  test("store resets correctly", () => {
    const store = createStore({ count: 0 });
    store.setState({ count: 5 });
    store.reset();
    expect(store.getState()).toEqual({ count: 0 });
  });
});
