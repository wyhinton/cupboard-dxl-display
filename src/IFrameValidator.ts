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
    const xoCheckArray = checkForXO(event);
    console.log(xoCheckArray);
    this.errors.push(...xoCheckArray);
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

function checkForXO(
  event: React.SyntheticEvent<HTMLIFrameElement, Event>
): IFrameLoadError[] {
  let errorsArray: IFrameLoadError[] = [];
  const test = event.target as HTMLIFrameElement;
//   console.log(test.contentDocument);
//   console.log(test.contentWindow);
  try { 
      
    test.contentWindow?.name;
  } catch (e) {
    if (e.message.includes("cross-origin")) {
      console.log(e.message);
      errorsArray.push(IFrameLoadError.CROSS_ORIGIN);
    } else return [];
  }
  return errorsArray;
}

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
