import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import "./PokeCard.css";
import { fetchUserInfo } from "../Api/api";
import { pushScore } from "../Api/api";
/*how many tries left*/

const Memory = () => {
  const [pokemon, setPokemon] = useState([]);
  const [cards, SetCards] = useState([]);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, SetDisabled] = useState();
  const [level, SetLevel] = useState(3);
  const [turns, SetTurns] = useState(3);
  const [userInfo, setUserInfo] = useState(null);
  const [time, setTime] = useState(0);
  const [stopwatchActive, setStopwatchActive] = useState(false);
  const [rounds, setRounds] = useState(0);
  const [fetchedPokemonIds, setFetchedPokemonIds] = useState(new Set());
  const [hasShuffled, setHasShuffled] = useState(false);

  let shuffledCards = [];

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const userId = queryParams.get("userId");
    const gameId = queryParams.get("gameId");
    const hash = queryParams.get("hash");

    if (userId && gameId && hash) {
      fetchUserAndSetupGame(userId, gameId, hash);
    } else {
      window.alert(
        "Game info was not pas on properly go to the website and try again https://109118.cvoatweb.be/"
      );
      // die('game will not run');  trun of die for local testing
    }
  }, []);

  const fetchNewPokemon = async () => {
    const newPokemon = [];
    const maxPokemonId = 898; // Assuming Gen 1-8, change as needed
    while (newPokemon.length < level) {
      const randomId = Math.floor(Math.random() * maxPokemonId) + 1;
      if (!fetchedPokemonIds.has(randomId)) {
        try {
          const response = await axios.get(
            `https://pokeapi.co/api/v2/pokemon-form/${randomId}`
          );
          const { name, sprites } = response.data;
          newPokemon.push({
            name,
            sprite: sprites.front_default,
            matched: false,
          });
          fetchedPokemonIds.add(randomId);
        } catch (error) {
          console.error("Failed to fetch new Pokémon:", error);
          alert("errro connecting to the server mostliky your falut");
        }
      }
    }
    return newPokemon;
  };

  const handleStopGame = async () => {
    const queryParams = new URLSearchParams(window.location.search);
    const userId = queryParams.get("userId");
    const gameId = queryParams.get("gameId");
    const hash = queryParams.get("hash");

    try {
      await pushScore(userId, gameId, hash, rounds, time);
      alert(`You were able to play ${rounds} rounds in ${time} seconds!`);
      window.location.href = `https://109118.cvoatweb.be/games/${gameId}`;
    } catch (error) {
      alert("Failed to submit score. Please try again.");
      console.error(
        "Error details:",
        error,
        "Submitted values:",
        userId,
        gameId,
        hash,
        rounds,
        time
      );
    }

    setHasShuffled(false); // Allow shuffling for the new round
    shuffleCards();
  };

  useEffect(() => {
    // Start the stopwatch when the game starts
    let interval = null;
    if (stopwatchActive) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (!stopwatchActive) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [stopwatchActive]);

  const resetStopwatchOnWin = () => {
    setTime(0);
    setStopwatchActive(false);
  };

  useEffect(() => {
    Promise.all(
      Array.from({ length: 20 }, (_, i) =>
        axios
          .get(`https://pokeapi.co/api/v2/pokemon-form/${i + 1}`)
          .then((res) => res.data)
          .then(({ name, sprites }) => ({
            name,
            sprite: sprites.front_default,
            matched: false,
          }))
      )
    ).then(setPokemon);
  }, []);

  // Function to fetch user information and setup game
  const fetchUserAndSetupGame = async (userId, gameId, hash) => {
    try {
      const userInfo = await fetchUserInfo(userId, gameId, hash);
      console.log("Fetched User Info:", userInfo);
      setUserInfo(userInfo);
    } catch (error) {
      window.alert(
        "Game info was not pas on properly go to the website and try again https://109118.cvoatweb.be/"
      );
    }
  };

  const handleClick = (poke) => {
    if (!disabled) {
      choiceOne ? setChoiceTwo(poke) : setChoiceOne(poke);
    }
  };

  const shuffleCards = async () => {
    if (hasShuffled) {
      // Prevent further execution if already shuffled in this round
      return;
    }
    setStopwatchActive(true);
    const newPokemon = await fetchNewPokemon();
    const shuffledCards = [...newPokemon, ...newPokemon]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));
    setChoiceOne(null);
    setChoiceTwo(null);
    SetCards(shuffledCards);
    SetTurns(3);
    console.log(newPokemon);
    setHasShuffled(true);
  };

  useEffect(() => {
    const allMatched = cards.every((card) => card.matched);
    if (allMatched && cards.length) {
      setRounds((prevRounds) => prevRounds + 1);
    }
  }, [cards]);

  const nextLevel = () => {
    SetLevel(5);
    shuffledCards = [...pokemon.slice(0, level), ...pokemon.slice(0, level)]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));
    setChoiceOne(null);
    setChoiceTwo(null);
    SetCards(shuffledCards);
    SetTurns(3);
  };

  const resetTurn = () => {
    if (choiceOne.sprite !== choiceTwo.sprite) {
      SetTurns((prevTurns) => prevTurns - 1);
    }

    setChoiceOne(null);
    setChoiceTwo(null);

    SetDisabled(false);
  };

  useEffect(() => {
    if (choiceOne && choiceTwo) {
      SetDisabled(true);
      if (choiceOne.sprite === choiceTwo.sprite) {
        SetCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.sprite === choiceOne.sprite) {
              return { ...card, matched: true };
            } else {
              return card;
            }
          });
        });
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [choiceOne, choiceTwo]);

  //start game auto

  useEffect(() => {
    // shuffleCards(); no more auto start turn turn this on if needed
    setRounds(0);
  }, []);

  useEffect(() => {
    if (turns <= 0) {
      handleStopGame();
    }
  }, [turns]);

  if (pokemon[0] !== undefined) {
  }

  function isSameAnswer(el, index, arr) {
    // Return true for the first element
    if (index === 0) {
      return true;
    } else {
      // Compare the value of the previous element
      return el.matched === arr[index - 1].matched;
    }
  } /* nextLevel() */
  /* SetLevel(prevTurns => prevTurns +1)
            console.log(level) */

  useEffect(() => {
    // Check if the game has been won
    if (
      cards.length !== 0 &&
      cards.some(checkIfOneMatched) &&
      cards.every(isSameAnswer)
    ) {
      shuffleCards();
      setHasShuffled(false); // Indicate that cards haven't been shuffled for the new round
    }
  }, [cards, checkIfOneMatched, isSameAnswer]);

  function checkIfOneMatched(match) {
    return match.matched === true;
  }

  return (
    <>
      <body className="bg-gray-100">
        <div className="bg-gray-100 min-h-screen flex flex-col items-center p-8">
          <div>
            <p>Stopwatch: {time} seconds</p>
            <p>Rounds: {rounds}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((poke, index) => (
              <div
                key={index}
                className="p-3 transition ease-in-out  hover:bg-gray-200  cursor-pointer rounded-md"
              >
                <div>
                  {poke === choiceOne || poke === choiceTwo || poke.matched ? (
                    <img
                      className="w-full h-24"
                      src={poke.sprite}
                      alt="Front card"
                    />
                  ) : (
                    <img
                      onClick={() => handleClick(poke)}
                      className="w-full h-24"
                      src="/images/pokeball.png"
                      alt="Back card"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
          <h1 className="text-2xl pl-2 font-extrabold">Turns left: {turns}</h1>
        </div>

        <header>
          <nav className="flex items-center justify-between flex-wrap p-6 fixed w-full z-10 top-0 bg-gray-600">
            {/* Logo or Brand Name */}
            <div className="flex items-center flex-shrink-0 text-white mr-6">
              <a className="text-white no-underline hover:text-white hover:no-underline">
                <span className="text-2xl pl-2 font-extrabold">
                  <button onClick={shuffleCards}>Start Game</button>
                </span>

                {/* check not null display user name and photo */}
                {userInfo && (
                  <div className="user-info">
                    <h2>Name: {userInfo.name}</h2>
                    <img
                      src={`https://109118.cvoatweb.be/${userInfo.photo}`}
                      alt="User Profile"
                      className="w-6 h-6 rounded-full bg-slate-100 ring-2 ring-white"
                    />
                  </div>
                )}
              </a>
            </div>

            {/* Navigation Links */}
            <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
              <div className="text-sm lg:flex-grow">
                <h1>
                  <div>
                    <p>Stopwatch: {time} seconds</p>
                    <p>Rounds: {rounds}</p>
                  </div>
                </h1>

                <h1></h1>
              </div>
            </div>
            <button onClick={handleStopGame}>Save and exit</button>
          </nav>
        </header>
      </body>
    </>
  );
};

export default Memory;
