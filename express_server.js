const express = require("express");
const app = express();
const PORT = 8000; //default port 8080

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs")

// data

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString() {
  return Math.floor(100000 + Math.random() * 900000);
  }
// 

app.post("/urls", (req, res) => {
  let newShortUrl = generateRandomString()
  urlDatabase[newShortUrl] = req.body.longURL
  console.log(req.body);  // Log the POST request body to the console
  res.redirect(`/urls/${newShortUrl}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
res.redirect("/urls");

})


app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

 app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]
  };
  res.render("urls_show", templateVars);
  res.redirect('/urls/longURL');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
