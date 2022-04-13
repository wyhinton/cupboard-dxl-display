import { action,createStore } from "easy-peasy";

import model from "./model";

const store = createStore(model, { name: "Cuboard App Store" });

export default store;
