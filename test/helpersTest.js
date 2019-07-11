const { assert } = require('chai');

const { croppedUrlDB, checkEmail, updateLongUrl, generateRandomString } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return an object confirming the email in DB and the users id', function() {
    const user = checkEmail("user@example.com", testUsers)
    const expectedOutput = { isValid: true, userID: 'userRandomID' };
    console.log(user)
    assert(user, expectedOutput)
  });

  it('should return not valid and null when passed nonexistant email',() => {
    const user = checkEmail('this isnt even an email', testUsers)
    const expectedOp = {isValid: false, userID: null}
    console.log(user)
    assert(user, expectedOp)
  })
});