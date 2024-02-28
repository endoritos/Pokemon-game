import React, { useEffect, useState } from 'react';
import { fetchUserInfo } from './Api/api.js'; // Importing the API call function

function GameComponent() {
  // State for URL parameters
  const [userId, setUserId] = useState('');
  const [gameId, setGameId] = useState('');
  const [hash, setHash] = useState('');

  useEffect(() => {
    // Extract URL parameters on component mount
    const queryParams = new URLSearchParams(window.location.search);
    setUserId(queryParams.get('userId'));
    setGameId(queryParams.get('gameId'));
    setHash(queryParams.get('hash'));

    // Optionally, call API here if needed on component mount
    // fetchUserInfo(userId, gameId, hash);
  }, []);

  // Component render and logic

  return <div>{/* Game UI */}</div>;
}

export default GameComponent;
