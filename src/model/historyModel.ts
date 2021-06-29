import { action, Action, thunk, Thunk, thunkOn, ThunkOn } from "easy-peasy";
import History from "../data_structs/History";
import { Layouts } from "react-grid-layout";

export interface HistoryModel {
  history: History;
  addEditHistory: Action<HistoryModel, Layouts>;
  undoIt: Action<HistoryModel>;
  redoIt: Action<HistoryModel>;
  undoHistory: Thunk<HistoryModel>;
  setCurrentHistory: Action<HistoryModel, Layouts>;
  // onAddTodo: ThunkOn<HistoryModel, any, StoreModel>;
}
const historyModel: HistoryModel = {
  history: new History(),
  undoHistory: thunk((actions, _, { getState }) => {
    // console.log(payload);
    actions.undoIt();
    actions.setCurrentHistory(getState().history.undo());
    // const newLayouts = state.history.undo();
    // console.log(newLayouts);
  }),
  undoIt: action((state) => {
    state.history.undo();
    console.log(state.history.currentStep);
    // console.log(payload);
  }),
  redoIt: action((state) => {
    state.history.redo();
    console.log(state.history.currentStep);
    // console.log(payload);
  }),
  setCurrentHistory: action((state, payload) => {
    console.log(payload);
  }),
  // undoHistory: action((state, layouts) => {
  //   console.log(layouts);
  //   const newLayouts = state.history.undo();
  //   console.log(newLayouts);
  // }),

  // undoHistory: action((state, layouts) => {
  //   console.log(layouts);
  //   const newLayouts = state.history.undo();
  //   console.log(newLayouts);
  // }),
  addEditHistory: action((state, layouts) => {
    console.log("adding edit history");
    console.log(layouts);
    const test = JSON.stringify(layouts);
    console.log(test);
    state.history.addEditEvent(layouts);
  }),
};

export default historyModel;
