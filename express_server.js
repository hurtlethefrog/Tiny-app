const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

function generateRandomString() {
  return Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5)
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

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
  let longURL = urlDatabase[shortURL];
  res.redirect(`/urls/${shortURL}`)

})

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  let ID = generateRandomString();
  urlDatabase[ID] = req.body.longURL
  res.redirect(`/urls/${ID}`);         
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});


app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});