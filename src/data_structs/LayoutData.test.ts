import * as LayoutData from "./LayoutData";
// @ponicode
describe("LayoutData.default.swapCard", () => {
  let inst: any;

  beforeEach(() => {
    inst = new LayoutData.default();
  });

  test("0", () => {
    inst.swapCard(undefined);
  });
});
