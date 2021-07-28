import { Layouts } from "react-grid-layout";
/**
 *
 */
export default class History {
  events!: Layouts[];
  currentStep!: number;

  constructor() {
    const emptyLayoutsArray: Layouts[] = [];
    this.events = emptyLayoutsArray;
    this.currentStep = 0;
  }
  addEditEvent(event: Layouts) {
    this.currentStep += 1;
    this.events.push(event);
  }
  undo(): Layouts {
    console.log(this.currentStep);
    this.currentStep -= 1;
    return this.events[this.currentStep];
  }
  redo(): Layouts {
    console.log(this.currentStep);
    this.currentStep += 1;
    return this.events[this.currentStep];
  }
}
