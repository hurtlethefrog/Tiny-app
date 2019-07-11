/**
 * will take a db and loop through its contents and output a new db will objects that belong to the specified user
 * @param {the user whose objects you want to filter} userID 
 * @param {the output db} newDB 
 * @param {the db to be filtered} oldDB 
 */
const croppedUrlDB = (userID, newDB, oldDB) => {
  for (const shortURL in oldDB) {
    if (userID === oldDB[shortURL].user) {
      newDB[shortURL] = oldDB[shortURL];
    }
  }
};

/**
 * will check a given email against a db and return the userID associated with the email if found, or will return not valid and null object
 * @param {the email to search for} email 
 * @param {the db to search} DB 
 */
const checkEmail = (email, DB) => {
  for (const userID in DB) {
    if (DB[userID].email === email) {
      return {isValid: true, userID};
    }
  } return {isValid: false, userID: null};
};

/**
 * will update the longurl for a given shorturl in a db
 * @param {the short url whose corresponding longurl needs to be changed} shortURL 
 * @param {the new longurl} longURL 
 * @param {the db where this change is to be made} DB 
 */
const updateLongUrl = (shortURL, longURL, DB) => {
  DB[shortURL] = longURL;
};

const generateRandomString = () => {
  return Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5);
};

module.exports = { croppedUrlDB, checkEmail, updateLongUrl, generateRandomString };