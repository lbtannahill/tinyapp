const express = require("express");
const cookieSession = require('cookie-session')
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const PORT = 8000; //default port 8080

const app = express();


//middlewear

app.use(express.static("public")); 

app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieSession({
  name: 'session',
  keys: ["longboys and smolboys", "itty bitty potatos dancing in the rain"],
}))

app.set("view engine", "ejs");

//data 

const urlDatabase = {
  b6UTxQ: {
      longURL: "https://www.tsn.ca",
      userID: "aJ48lW"
  },
  i3BoGr: {
      longURL: "https://www.google.ca",
      userID: "aJ48lW"
  }
};

const users = {
  "userRandomID": {
    id: "aJ48lW",
    email: "user@example.com",
    password: bcrypt.hashSync("asdf")
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk")
  }
};


const generateRandomString = (len) => {
	let randomString = "";
	for (let i = 0; i < len; i++) {
		let rndm = Math.floor(Math.random() * 62);
		if (rndm <= 9) {
			randomString += String.fromCharCode(rndm + 48);
		} else if (rndm >= 36) {
			randomString += String.fromCharCode(rndm + 61);
		} else {
			randomString += String.fromCharCode(rndm + 55);
		}
	}

	return randomString;
};


const getUrlsForUser = function(userID) {
  const results = {}
  const shortUrls = Object.keys(urlDatabase);

  for (const shortUrl of shortUrls) {
    const url = urlDatabase[shortUrl];
    if(url.userID === userID) {
      results[shortUrl] = url; 
    }
  }
return results
};


const checkForEmail = function(object, value) {
  let alreadyReg = false;
  for (const item in object) {
    for (let property in object[item]) {
      if (object[item][property] === value) {
        alreadyReg = true;
      }
    }
  }
  return alreadyReg;
};


const getUserByEmail = function (email) {
const keys = Object.keys(users)
  for (let key of keys) {
    const user = users[key];
    if(user.email === email) {
      return user; 
    }
} 
return null;
}


// Routes

// Home

app.get("/", (req, res) => {
  res.redirect("/urls");
  res.end();
});

// Main Page

app.get("/urls", (req, res) => {
  const userID = req.session['user_id']
  const user = users[userID];
  if(!user)
    {return res.redirect('/urls/login') };

  const urls1 = getUrlsForUser(userID)

  const templateVars = { urls: urls1, user: users[userID]};
  res.render("urls_index", templateVars);
  res.end();
});


app.post("/urls", (req, res) => {
  let newShortUrl = generateRandomString(7);
  const userID = req.session['user_id']
  let longBoy = req.body.longURL;
  urlDatabase[newShortUrl] = {
    longURL: longBoy,
    userID: userID };

  return res.redirect(`/urls/${newShortUrl}`);
});




// LOGIN

app.get("/urls/login",  (req, res) => {
  const userID = req.session['user_id']
  const templateVars = { urls: urlDatabase, user: users[userID],
  };
  const user = users[userID]
  res.render("urls_login", templateVars);
} );

app.post('/urls/login', (req,res) => {
    const email = req.body.email
    const password = req.body.password
    const user = getUserByEmail(email);


  if (!user) {
    return res.redirect('/urls/register') 
  };
  
  if (!bcrypt.compareSync(password, user.password) ){ 
    return res.redirect('/400') 
  };
  
      req.session.user_id = user.id
    res.redirect('/urls'); 
  });
  
// register 


app.get("/urls/register",  (req, res) => {
  const userID = req.session['user_id']
  const templateVars = {
    urls: urlDatabase, user: users[userID],
  };
  res.render("urls_register", templateVars);
});

app.post('/urls/register', (req,res) => {
  const newEmail = req.body.email;
  const newPassword = req.body.password;
  const newId = generateRandomString(6);

  if (checkForEmail(users, newEmail) === true) {
    res.redirect('/400');
  }
  if (!newEmail || !newPassword) {
    res.redirect('/400');
  }
    users[newId] = {id: newId, email: newEmail, password: bcrypt.hashSync(newPassword, 10)};
    req.session.user_id = users[newId].id
    res.redirect('/urls');
}
);

// logout 

app.post("/logout", (req, res) => {
  req.session = null
  res.redirect("/urls");
});


// create new URL

app.get("/urls/new", (req, res) => {
 
  const userID = req.session['user_id']
  const templateVars = {
    urls: urlDatabase, user: users[userID], 
  };

  if(!userID)
  {return res.redirect('/urls/login') };
  
  res.render("urls_new", templateVars);
});

// create short URL Show Pge
 
const compareURLS = function(urlOutput, url) {
   for (let urls in urlOutput) {
    if (urls === url) {
      return true
    }
  }
  return false 
};

app.get("/urls/:shortURL", (req, res) => {
  let shortBoy = req.params.shortURL
  if (!urlDatabase[shortBoy]) {
    return res.redirect('/400')
  }
  const userID = req.session['user_id']
  const templateVars = {
        user: users[userID],
        shortURL: shortBoy,
        urls: urlDatabase
      };

      if(!userID) {
        return res.redirect('/urls/login') 
      };
      let userURLS = getUrlsForUser(userID)

      if (compareURLS(userURLS, shortBoy) === false) {
        return res.redirect('/404') 
      }

  return res.render("urls_show", templateVars);
});



// send data to short URL Show Page

app.post("/urls/:shortURL", (req, res) => {
  const newURL = req.body.longURL;
  const shortBoy = req.params.shortURL
  const usersURLS = getUrlsForUser(req.session.user_id)
  if (usersURLS[shortBoy] ) {
    urlDatabase[shortBoy].longURL = newURL;
    return res.redirect(`/urls/${shortBoy}`);
  }

  
});

//

app.get("/u/:shortURL", (req, res) => {
  const shortBoy = req.params.shortURL;

  const longBoy = urlDatabase[shortBoy]["longURL"];

  return res.status(301).redirect(longBoy);

});

// app.get("/u/:shortURL", (req, res) => {
//   const shortURL = req.params.shortURL;
//   if (!urlDatabase[shortURL]) {
//     return res.status("404").send(`OOPS! Looks like the link does not exist.\n`);
//   }

//   const longURL = urlDatabase[shortURL]["longURL"];
//   return res.redirect(longURL);
// });

// delete short URL 

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");

});


// error pages 

app.get('/400', (req,res) => {
  res.render('400');
  res.end();
});
  
app.get('*', (req,res) => {
  res.render('404');
  res.end();
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

