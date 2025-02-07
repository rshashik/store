import "reflect-metadata";
import { createStore } from "./store";

let log = "Hello Typescript";
document.body.innerText = log;

const userStore = createStore(() => ({
  name: "John Doe",
  age: 30,
  loggedIn: false,
}));

userStore.subscribe((state) => console.log("State updated:", state));
userStore.subscribe((state) => console.log("State updated 2:", state));
userStore.setState((prev) => ({ ...prev, loggedIn: true }));
userStore.setState((prev) => ({ ...prev, age: 22 }));
