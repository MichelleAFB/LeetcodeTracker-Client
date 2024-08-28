import update from 'immutability-helper'
import { useCallback, useState } from 'react'
import { Card } from './Card.js'
const style = {
  width: 400,
}
export const Container = () => {
  {
    const [cards, setCards] = useState([
      {
        id: 1,
        text: 'Total # Questions',
      },
      {
        id: 2,
        text: 'Consistency',
      },
      {
        id: 3,
        text: 'Earliest',
      },
    
    ])
    sessionStorage.setItem('priorities',JSON.stringify(cards))
    const moveCard = useCallback((dragIndex, hoverIndex) => {
      setCards((prevCards) =>
        fix(prevCards,dragIndex,hoverIndex)
        /*
        update(prevCards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevCards[dragIndex]],
          ],
        }),*/
      )
    }, [])
    function fix(prevCards,dragIndex,hoverIndex){
    console.log('in fix function:',dragIndex, ' hover index:',hoverIndex)
     var c=update(prevCards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevCards[dragIndex]],
        ],
      })
      return c

    }
    const renderCard = useCallback((card, index) => {
      console.log('moving ',card,"index:",index)
      const c=JSON.parse(sessionStorage.getItem('priorities'))
      var ind=0
      c.map((k)=>{
        console.log(k)
        if(k.text==card.text){
         // c[i].index=
         console.log(k,"index:",index)
        }
        ind++
      })
      console.log(cards)
      return (
        <Card
          key={card.id}
          index={index}
          id={card.id}
          text={card.text}
          moveCard={moveCard}
        />
      )
    }, [])
    return (
      <>
        <div style={style}>{cards.map((card, i) => renderCard(card, i))}</div>
      </>
    )
  }
}