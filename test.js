const usersDatabase = { 
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
}
// returns true if email exists already in DB
const checkEmail = (email) => {
  for (const user in usersDatabase) {
    if (user.email === email) {
      return true
    }
  } return false;
}

if (checkEmail('user2@example.com')) {
  console.log('400: email is taken, please choose another')
}