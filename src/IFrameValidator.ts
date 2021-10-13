enum IFrameLoadError {
  CROSS_ORIGIN = "CROSS_ORIGIN",
}

enum IFrameLoadWarning {
  MALFORMED_URL = "MALFORMED_URL",
}

class IFrameValidator {
  url!: string;
  errors!: IFrameLoadError[];
  warnings!: IFrameLoadWarning[];
  constructor(url: string) {
    this.errors = [];
    this.warnings = [];
    this.url = url;
  }
  validate(event: React.SyntheticEvent<HTMLIFrameElement, Event>): void {
    console.log(this.errors);
    const malformedUrlCheckArray = validURL(this.url);
    this.warnings.push(...malformedUrlCheckArray);
    console.log(malformedUrlCheckArray);
  }
  isValid(): boolean {
    return this.errors.length == 0;
  }
  errorMessages(): string[] {
    let errors: string[] = [];
    this.errors.map((e) => {
      switch (e) {
        case IFrameLoadError.CROSS_ORIGIN:
          errors.push(
            `Blocked a frame with origin ${this.url}; from accessing a cross-origin frame.`
          );
          break;
        default:
          console.log("error did not match an error enum");
      }
    });
    return errors;
  }
}

export default IFrameValidator;



function validURL(str: string): IFrameLoadWarning[] {
  let warningsArray = [];
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  if (!pattern.test(str)) {
    warningsArray.push(IFrameLoadWarning.MALFORMED_URL);
  }
  return warningsArray;
}
