import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import "./PokeCard.css"


/*how many tries left*/

const Memory = () => {
    const [pokemon, SetPokemon] = useState([]);
    const [cards,SetCards] = useState([]);
    const [choiceOne,setChoiceOne] = useState(null);
    const [choiceTwo,setChoiceTwo] = useState(null);
    const [disabled,SetDisabled] = useState();
    const [level,SetLevel] = useState(3);
    const [turns,SetTurns] = useState(3);
    let shuffledCards = [];
    
    
        useEffect(() => {
            Promise.all(Array.from({ length: 20 }, (_, i) =>
              fetch(`https://pokeapi.co/api/v2/pokemon-form/${i + 1}`)
                .then(res => res.json())
                .then(({ name, sprites }) => ({
                  name,
                  sprite: sprites.front_default,
                  matched: false,
                }))
              )).then(SetPokemon)
          },[]);

        const handleClick = (poke) => {
            if (!disabled) {
                choiceOne ? setChoiceTwo(poke) : setChoiceOne(poke)
            }
            
        }
        
        const shuffleCards = () => {
            shuffledCards = [...pokemon.slice(0,3),...pokemon.slice(0,3)]
                .sort(() => Math.random() - 0.5)
                .map((card) => ({...card, id:Math.random()}))
            setChoiceOne(null)
            setChoiceTwo(null)
            SetCards(shuffledCards)
            SetTurns(3)
            SetLevel(3)
        }

        const nextLevel = () => {
            SetLevel(5)
            shuffledCards = [...pokemon.slice(0,level),...pokemon.slice(0,level)]
                .sort(() => Math.random() - 0.5)
                .map((card) => ({...card, id:Math.random()}))
            setChoiceOne(null)
            setChoiceTwo(null)
            SetCards(shuffledCards)
            SetTurns(3)
            
            
        }

        const resetTurn = () => {
            
            
            if (choiceOne.sprite !== choiceTwo.sprite) {
                SetTurns(prevTurns => prevTurns - 1)
            }
            
            setChoiceOne(null)
            setChoiceTwo(null)
            
            SetDisabled(false)
        }

        useEffect(() => {
            if (choiceOne && choiceTwo) {   
                SetDisabled(true)
                if (choiceOne.sprite === choiceTwo.sprite) {
                    SetCards(prevCards => {
                        return prevCards.map(card => {
                            if(card.sprite === choiceOne.sprite) {
                                return {...card, matched:true}
                            } else {
                                return card
                            }
                        })
                    })
                    resetTurn()
                } else {
                    setTimeout(() => resetTurn(), 1000)
                }
            }
        },[choiceOne,choiceTwo])

        //start game auto

        useEffect(() => {
            shuffleCards()
        },[])

        if (turns <= 0) {
            shuffleCards()
            /* alert("You lost, play again?"); */
        }
        if (pokemon[0] !== undefined) {
            
            
        }

        function isSameAnswer(el,index,arr) {
            // Return true for the first element
            if (index === 0){
              return true;
            }
            else {
            // Compare the value of the previous element
              return (el.matched === arr[index-1].matched);
            }
          }
          if (cards.length !== 0 && cards.some(checkIfOneMatched) && cards.every(isSameAnswer)) {
            console.log("you win!")
            /* nextLevel() */
            /* SetLevel(prevTurns => prevTurns +1)
            console.log(level) */
            }
        function checkIfOneMatched(match) {
            return match.matched === true
        }
        
        
    return (
        <>
                <div className="bg-gray-100 min-h-screen flex flex-col items-center p-8">
                    <h1 className="font-bold">Memory game</h1>
                    <button onClick={shuffleCards}>Start game</button>
                    
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cards.map((poke, index) => (
                    <div key={index} className="p-3 transition ease-in-out  hover:bg-gray-200  cursor-pointer rounded-md">
                        <div>
                            {
                            poke === choiceOne || poke == choiceTwo || poke.matched  ? 
                            <img className="w-full h-24" src={poke.sprite} alt="front card" /> 
                            : 
                            <img onClick={()=> handleClick(poke)} className="w-full h-24" src="/images/pokeball.png" alt="back card" />
                            } 
                        </div>
                    </div>
                    ))}
              </div>
              <p>Turns left: {turns}</p>
              </div>
            
        </>
    )
    
}

export default Memory