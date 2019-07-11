const express = require("express");
const app = express();
const PORT = 8080; 
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');
const { croppedUrlDB, checkEmail, updateLongUrl, generateRandomString } = require('./helpers');

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(cookieSession({
  name: 'session',
  keys: ['thisisaverysecretkeyok'],
}));

const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    user: 'string'
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    user: 'string'
  }
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
};

app.post("/urls/:shortURL/delete", (req, res) => {
  let { shortURL } = req.params;
  const userID = req.session['user_id'];
  if (urlDatabase[shortURL].user === userID) {
    delete urlDatabase[shortURL];
    res.redirect('/urls');
  } res.status(400).render('403: please log into the apropriate TinyUrl account to delete this URL');
});

app.post("/urls/updating/:shortURL", (req, res) => {
  let { shortURL} = req.params;
  let longURL = req.body.longURL;
  const userID = req.session['user_id'];
  
  if (urlDatabase[shortURL].user === userID) {
    updateLongUrl(shortURL, longURL, urlDatabase);
    res.redirect('/urls');
  } res.status(400).render('403: please log into the apropriate TinyUrl account to modify this URL');
});

app.get("/urls/:shortURL/update", (req, res) => {
  let { shortURL } = req.params;
  res.redirect(`/urls/${shortURL}`);

});

app.post('/urls/:shortURL/update', (req, res) => {
  let longURL = req.body.longURL;
  let shortURL = req.params.shortURL;
  urlDatabase[shortURL].longURL = longURL;
  res.redirect('/urls');
});

app.get("/urls/new", (req, res) => {
  const userID = req.session['user_id'];
  let templateVars = {
    urls: urlDatabase,
    user: usersDatabase[userID]
  };
  if (userID) {
    res.render("urls_new", templateVars);
  } else {
    res.redirect('/login');
  }
});

app.post("/urls", (req, res) => {
  let ID = generateRandomString();
  let { longURL } = req.body;
  urlDatabase[ID] = {
    longURL,
    user: req.session['user_id']
  };
  res.redirect(`/urls/${ID}`);
});

app.get("/urls", (req, res) => {
  const userID = req.session['user_id'];
  let userUrlDB = {};

  croppedUrlDB(userID, userUrlDB, urlDatabase);

  let templateVars = {
    urls: userUrlDB,
    user: usersDatabase[userID]
  };
  res.render("urls_index", templateVars);
});


app.get("/urls/:shortURL", (req, res) => {
  const userID = req.session['user_id'];

  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: usersDatabase[userID]
  };
  if (urlDatabase[req.params.shortURL].user === userID) {
    res.render("urls_show", templateVars);
  } throw '403: please log into the apropriate TinyUrl account to modify this URL';
});

app.get("/", (req, res) => {
  const userID = req.session['user_id'];
  const templateVars = {
    user: usersDatabase[userID]
  }
  if (userID) {
    res.redirect('/urls')
  }
  res.render("home", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get('/login', (req, res) => {
  const userID = req.session['user_id'];
  const templateVars = {
    user: usersDatabase[userID]
  };
  res.render('login_page', templateVars);
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  for (const user in usersDatabase) {
    if (usersDatabase[user].email === email) {
      if (bcrypt.compareSync(password, usersDatabase[user].password)) {
        req.session.user_id = usersDatabase[user].id;
        res.redirect('/urls');
      } else {
        throw '403: password incorrect, please try again';
      }
    }
  } throw '403: email not found, please try again';
});

app.post('/logout', (req, res) => {
  res.clearCookie('session');
  res.redirect('/urls');
});

app.get('/register', (req, res) => {
  const userID = req.session['user_id'];
  const templateVars = {
    user: usersDatabase[userID]
  };
  res.render('registration', templateVars);
});

app.post('/register', (req, res) => {
  const { email, password } = req.body;
  if (email === "" || password === "") {
    res.status(400).send('400: empty field, please fill in both fields');
  }
  if (checkEmail(email,usersDatabase).isValid) {
    res.status(400).send('400: email is taken, please choose another');
  }
  let id = generateRandomString();
  usersDatabase[id] = {
    id,
    email,
    password : bcrypt.hashSync(password, 10)
  };
  req.session.user_id = id;
  res.redirect('/urls');

});
// redirects to a longurl after clicking on the corresponding shorturl
app.get('/u/:shortURL', (req, res) => {
  const fullsite = urlDatabase[req.params.shortURL].longURL;

  res.redirect(fullsite);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});