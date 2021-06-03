import type { RawCardInfoRow } from "./google_sheet";
/**
 * Code blocks are great for examples
 *
 * ```typescript
 * // run typedoc --help for a list of supported languages
 * const instance = new MyClass();
 * ```
 */
export default class CardData {
  readonly src: string;
  readonly title: string;

  constructor(row: RawCardInfoRow) {
    this.src = row.src;
    this.title = row.title;
  }
}
