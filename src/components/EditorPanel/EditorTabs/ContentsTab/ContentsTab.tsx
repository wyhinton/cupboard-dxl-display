import Button from '../../../Shared/Button';
import CardData from '../../../../data_structs/CardData';
import fuzzysort from 'fuzzysort';
import IXDrop from '../../../IXDrop';
import React, {
  useEffect,
  useState
  } from 'react';
import TableHeader from '../../TableHeader';
import XDrag from '../../../XDrag';
import { DndTypes, DragSource } from '../../../../enums';
import { formatDate } from '../../../../utils';
import { SearchInput } from 'evergreen-ui';
import { Scrollbars } from 'react-custom-scrollbars';
import { useStoreActions, useStoreState } from '../../../../hooks';
import '../../../../css/table.css';
/**
 * Content tab display a list of the availalbe cards, and search bar for quickly finding cards by their title.
 */

//TODO: REFACTOR

const ContentsTab = (): JSX.Element => {
  const availableCards = useStoreState(
    (state) => state.appModel.availableCards
  );
  const clearCardsAction = useStoreActions(actions=>actions.layoutsModel.clearCards)
  const [filterKey, setFilterKey] = useState<string | undefined>();
  const [filterDirection, setFilterDirection] = useState(true);
  const [cardItems, setCardItems] = useState(availableCards);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCards, setFilteredCards] =
    useState<CardData[]>(availableCards);

  //use search input to filter cards
  useEffect(() => {
    if (searchTerm.length > 0) {
      const sortResult = fuzzysort.go(
        searchTerm,
        cardItems.map((c) => c.title)
      );
      const aboveThreshholdCardTitles: string[] = sortResult.map(
        (s) => s.target
      );
      const filtered = cardItems.filter((c) =>
        aboveThreshholdCardTitles.includes(c.title)
      );
      setFilteredCards(filtered);
    } else {
      setFilteredCards(cardItems);
    }
  }, [searchTerm, cardItems]);

  //sort values by column attribute, if filterDirection is true, sort descending, else sort ascending
  useEffect(() => {
    const key = filterKey as keyof CardData;
    const clone = [...availableCards];

    const sortedItems = clone.sort((a, b) => {
      const aText = a[key];
      const bText = b[key];
      if (aText && bText) {
        if (aText < bText) {
          return -1;
        }
        if (aText > bText) {
          return 1;
        }
      }
      return 0;
    });
    !filterDirection ? sortedItems.reverse() : null;
    setCardItems(sortedItems);
  }, [filterKey, availableCards, filterDirection]);


  const contentTabHeader = "contents-table-header";
  return (
    <div className={"contents-tab-container"}>
      <div style={{ padding: "0.5em" }}>
        <Button
          text = "Clear All"
          intent = "danger"
          appearance="primary"
          onClick={(e)=>{clearCardsAction()}}
        />
          <Button
          text = "Reset Layout"
          intent = "danger"
          appearance="primary"
          onClick={(e)=>{clearCardsAction()}}
        />
        <SearchInput
          width={"100%"}
          onChange={(event: React.FormEvent<HTMLInputElement>) =>
            setSearchTerm(event.currentTarget.value)
          }
          placeholder={"search title"}
        ></SearchInput>
      </div>
      <IXDrop
        className={"table-container"}
        droppableId={DragSource.CARD_TABLE}
        isDropDisabled={true}
        cardType={DndTypes.CLOCK}
      >
        <table className={"contents-tab-table"}>
          <tbody>
            <tr>
              {["title", "added", "sourceId", "author", "interaction"].map(
                (s, i) => {
                  return (
                    <TableHeader
                      key={i}
                      className={contentTabHeader}
                      headerTitle={s}
                      setFilter={setFilterKey}
                      activeFilter={filterKey}
                      setFilterDirection={setFilterDirection}
                    ></TableHeader>
                  );
                }
              )}
            </tr>
          </tbody>
        </table>
        <Scrollbars
          autoHeight
          autoHeightMin={100}
          autoHeightMax={319}
          onScrollFrame={(v) => console.log(v)}
        >
          <table style={{ padding: "2em" }}>
            <tbody>
              {filteredCards.map((card, index) => {
                const { added, src, author, interaction, sourceId, isActive } =
                  card;
                return (
                  <XDrag
                    dndType={DndTypes.CARD_ROW}
                    draggableId={sourceId}
                    index={index}
                    key={index.toString()}
                    isDragDisabled={isActive}
                    className={
                      isActive ? "content-row-active" : "content-row-inactive"
                    }
                  >
                    <>
                      <td>
                        <TitleWithIcon card={card} />
                      </td>
                      <td>{formatDate(added)}</td>
                      <td>{src}</td>
                      <td>{author}</td>
                      <td>{interaction}</td>
                    </>
                  </XDrag>
                );
              })}
            </tbody>
          </table>
        </Scrollbars>
      </IXDrop>
    </div>
  );
};



/**
 * Fetches a favicon for a card and displays the cards title
 */
const TitleWithIcon = ({ card }: { card: CardData }): JSX.Element => {
  return (
    <div style={{ display: "flex" }}>
      <img
        className={
          card.isActive ? "row-favicon-active" : "row-favicon-inactive"
        }
        src={`https://s2.googleusercontent.com/s2/favicons?domain_url=${card.src}`}
      ></img>
      <div
        style={{
          marginTop: "auto",
          marginBottom: "auto",
          textAlign: "left",
        }}
      >
        {card.src}
      </div>
    </div>
  );
};

export default ContentsTab;
