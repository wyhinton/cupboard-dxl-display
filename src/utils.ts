import type GoogleSheet from "./interfaces/GoogleSheet";
import type SheetId from "./interfaces/SheetId";

// export function getSheet<T>(sheetId: SheetId): Promise<GoogleSheet<T>> {
//   return new Promise<GoogleSheet<T>>(function (resolve, reject) {
//     fetch(
//       "https://spreadsheets.google.com/feeds/list/1wQ1TGqnCTmaqqDak1rTRxPMSGSGLMilwrecf7TuqDGc/1/public/values?alt=json"
//     ).then((res) => {
//       console.log(res);
//       res.json();
//     });
//     // labeledCols(sheetId.key, sheetId.sheet_number)
//     GetSheetDone.labeledCols(sheetId.key, sheetId.sheet_number)
//       .then((sheet: GoogleSheet<T>) => {
//         console.log(sheet);
//         resolve(sheet);
//       })
//       .catch((error: unknown) => {
//         console.error(
//           `Error: ${error} fetching DOC_KEY ${sheetId.key}, sheet number ${sheetId.sheet_number}`
//         );
//       });
//   });
// }

export function formatDate(date: Date | undefined): string {
  if (date) {
    const d = new Date(date);
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();
    const year = d.getFullYear().toString().slice(2);

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [month, day, year].join(".");
  } else {
    return "faulty date";
  }
}

// String.prototype.toTitleCase = function () { return this.valueOf().toLowerCase().replace(this.valueOf()[0], this.valueOf()[0].toUpperCase()); }
export function toTitleCase(string: string) {
  const words = string.split(" ");
  return words.map((w) => titleCapitilization(w)).join(" ");
}
function titleCapitilization(string: string) {
  const regex = /^[a-z]{0,1}|\s\w/gi;

  string = string.toLowerCase();

  string.match(regex)?.forEach((char) => {
    string = string.replace(char, char.toUpperCase());
  });

  return string;
}

export function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randomNumber(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

// function

// const toTitleCase = (str: string) => {
//   const articles = ['a', 'an', 'the'];
//   const conjunctions = ['for', 'and', 'nor', 'but', 'or', 'yet', 'so'];
//   const prepositions = [
//     'with', 'at', 'from', 'into','upon', 'of', 'to', 'in', 'for',
//     'on', 'by', 'like', 'over', 'plus', 'but', 'up', 'down', 'off', 'near'
//   ];

//   // The list of spacial characters can be tweaked here
//   const replaceCharsWithSpace = (str) => str.replace(/[^0-9a-z&/\\]/gi, ' ').replace(/(\s\s+)/gi, ' ');
//   const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.substr(1);
//   const normalizeStr = (str) => str.toLowerCase().trim();
//   const shouldCapitalize = (word, fullWordList, posWithinStr) => {
//     if ((posWithinStr == 0) || (posWithinStr == fullWordList.length - 1)) {
//       return true;
//     }

//     return !(articles.includes(word) || conjunctions.includes(word) || prepositions.includes(word));
//   }

//   str = replaceCharsWithSpace(str);
//   str = normalizeStr(str);

//   let words = str.split(' ');
//   if (words.length <= 2) { // Strings less than 3 words long should always have first words capitalized
//     words = words.map(w => capitalizeFirstLetter(w));
//   }
//   else {
//     for (let i = 0; i < words.length; i++) {
//       words[i] = (shouldCapitalize(words[i], words, i) ? capitalizeFirstLetter(words[i], words, i) : words[i]);
//     }
//   }

//   return words.join(' ');
// }
