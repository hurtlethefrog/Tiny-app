const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(cookieParser())

function generateRandomString() {
  return Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5)
}


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

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
  for (const userID in usersDatabase) {
    if (usersDatabase[userID].email === email) {
      return true
    }
  } return false;
}

const updateLongUrl = (shortURL, longURL) => {
  urlDatabase[shortURL] = longURL;
};

app.post("/urls/:shortURL/delete", (req, res) => {
  let { shortURL } = req.params;
  delete urlDatabase[shortURL];
  res.redirect('/urls')
})

app.post("/urls/updating/:shortURL", (req, res) => {
  let { shortURL} = req.params;
  let longURL = req.body.longURL;
  
  updateLongUrl(shortURL, longURL);

  res.redirect('/urls')
})

app.get("/urls/:shortURL/update", (req, res) => {
  let { shortURL } = req.params;
  res.redirect(`/urls/${shortURL}`)

})

app.get("/urls/new", (req, res) => {
  const userID = req.cookies['user_id']
  let templateVars = {
    urls: urlDatabase,
    user: usersDatabase[userID]
  }
  res.render("urls_new", templateVars);
});

app.post("/urls", (req, res) => {
  let ID = generateRandomString();
  urlDatabase[ID] = req.body.longURL
  res.redirect(`/urls/${ID}`);         
});

app.get("/urls", (req, res) => {
  const userID = req.cookies['user_id']
  let templateVars = { 
    urls: urlDatabase,
    user: usersDatabase[userID]
   };
  res.render("urls_index", templateVars);
});


app.get("/urls/:shortURL", (req, res) => {
  const userID = req.cookies['user_id']
  let templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL],
    user: usersDatabase[userID]
   };
  res.render("urls_show", templateVars);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.post('/login', (req, res) => {
  res.cookie('name' ,req.body.username)
  res.redirect('/urls')
})

app.post('/logout', (req, res) => {
  res.clearCookie('name')
  res.redirect('/urls')
})

app.get('/register', (req, res) => {
  const userID = req.cookies['user_id'];
  templateVars = {
    user: usersDatabase[userID]
  }
  res.render('registration', templateVars)
})

app.post('/register', (req, res) => {
  let { email, password } = req.body;
  if (email === "" || password === "") {
    res.status(400).send('400: empty field, please fill in both fields')
  }
  if (checkEmail(email)) {
    res.status(400).send('400: email is taken, please choose another')
  }
  let id = generateRandomString();
  usersDatabase[id] = {
    id,
    email,
    password
  };
  res.cookie('user_id', id)
  res.redirect('/urls');

})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});