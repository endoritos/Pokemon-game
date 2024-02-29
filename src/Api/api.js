


export const fetchUserInfo = async (userId, gameId, hash) => {
    try {
      const response = await fetch(`https://109118.cvoatweb.be/endy/user/info?userId=${userId}&gameId=${gameId}&hash=${hash}`, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data; 
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error;
    }
  };


  import axios from 'axios';

  export const pushScore = async (userId, gameId, hash, score, bestTime) => {
    try {
      // Create URL-encoded form data
      const formData = new URLSearchParams();
      formData.append('userId', userId);
      formData.append('gameId', gameId);
      formData.append('hash', hash);
      formData.append('score', score);
      formData.append('bestTime', bestTime);
  
      const response = await axios.post('https://109118.cvoatweb.be/endy/score', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
  
      console.log('Score pushed successfully:', response.data);
      return response.data; // Return the response data for further processing if needed
    } catch (error) {
      console.error('Failed to push score:', error);
      throw error; // Re-throw the error to handle it in the calling component
       console.log()
    }
   
  };
  