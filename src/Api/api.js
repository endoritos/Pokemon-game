export const fetchUserInfo = async (userId, gameId, hash) => {
    try {
      const response = await fetch(`https://109118.cvoatweb.be/endy/user/info?userId=${userId}&gameId=${gameId}&hash=${hash}`, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data); // Logging the results
      return data; // Returning the data for further use
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error; // Rethrowing the error for further handling if necessary
    }
  };
