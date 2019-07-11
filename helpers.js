const croppedUrlDB = (userID, newDB, oldDB) => {
  for (const shortURL in oldDB) {
    if (userID === oldDB[shortURL].user) {
      newDB[shortURL] = oldDB[shortURL];
    }
  }
};

// returns true and userID if email exists already in DB
const checkEmail = (email, DB) => {
  for (const userID in DB) {
    if (DB[userID].email === email) {
      return {isValid: true, userID};
    }
  } return {isValid: false, userID: null};
};

const updateLongUrl = (shortURL, longURL, DB) => {
  DB[shortURL] = longURL;
};

const generateRandomString = () => {
  return Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5);
};

module.exports = { croppedUrlDB, checkEmail, updateLongUrl, generateRandomString };