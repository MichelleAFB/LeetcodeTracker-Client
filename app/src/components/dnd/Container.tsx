import update from 'immutability-helper'
import type { FC } from 'react'
import { useEffect,useCallback, useState } from 'react'

//import { Card } from './Card'

const style = {
  width: 400,
}

export interface Item {
  id: number
  text: string
}

export interface ContainerState {
  cards: Item[]
}

export const Container: FC = () => {
  {
  
    const [cards, setCards] = useState([
      {
        id: 1,
        text: 'Total # of Questions',
      },
      {
        id: 2,
        text: 'Earliest Submition',
      },
      {
        id: 3,
        text: 'Streak Consistenty',
      },
     
    ])
    const[ourCards,setOurCards]=useState([
        {
          id: 1,
          text: 'Total # of Questions',
        },
        {
          id: 2,
          text: 'Earliest Submition',
        },
        {
          id: 3,
          text: 'Streak Consistenty',
        },
       
      ])
    const moveCard = useEffect((dragIndex: number, hoverIndex: number) => {
        console.log("drag:",cards[dragIndex]," " ,dragIndex)
        console.log("hover",hoverIndex)
        var c=cards
        c[dragIndex]=cards[dragIndex]
        sessionStorage.setItem("gradingPriority",JSON.stringify(c))
        console.log(c)
        setOurCards(prevCards=> update(prevCards, {
            $splice: [
              [dragIndex, 1],
              [hoverIndex, 0, prevCards[dragIndex] as Item],
            ],
          }),
        
        )
      setCards((prevCards: Item[]) =>
       

        update(prevCards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevCards[dragIndex] as Item],
          ],
        }),
    
      )
      sessionStorage.setItem('gradingPriorities',JSON.stringify(cards))
    }, [cards])

    const renderCard = useCallback(
      (card: { id: number; text: string }, index: number) => {
      console.log("vard",cards)
        return (
          <Card
            key={card.id}
            index={index}
            id={card.id}
            text={card.text}
            moveCard={moveCard}
          />
        )
      },
      [],
    )
    return(<div>hi</div>)
/*
    return (
      <>
        <div style={style}>{cards.map((card, i) => renderCard(card, i))}</div>
      </>
    )
  }
  */
  }
}
