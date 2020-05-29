const express = require('express')
const app = express();
const http = require('http')
const axios = require("axios");
const bodyparser = require('body-parser')
const NewsAPI = require('newsapi');
const path = require('path');
const fetch = require('node-fetch');

let xmlParser = require('xml2json');
const newsapi = new NewsAPI('da5a2389155c443f8e00a9812ef591e7');

app.use(express.static(path.join(__dirname, 'views')));

app.set('views','views')
app.set('view engine','ejs')
app.use(bodyparser({urlencoded:true}))

var publicDir = require('path').join(__dirname,'/public')
app.use(express.static(publicDir))

app.get('/',(req,res)=>{
  res.render("home");
})

app.get('/signupnews',(req,res)=>{
  res.render('newsupdates/signupnews')
})

app.post('/signupnews', (req, res) => {
  const { firstName, lastName, email } = req.body;

  // Make sure fields are filled
  if (!firstName || !lastName || !email) {
    res.redirect('/newsupdates/fail.html');
    return;
  }

  // Construct req data
  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const postData = JSON.stringify(data);

  fetch('https://us18.api.mailchimp.com/3.0/lists/3e474108b3', {
    method: 'POST',
    headers: {
      Authorization: 'auth b609ff89d27cc1983ebfe71d42815353-us18'
    },
    body: postData
  })
    .then(res.statusCode === 200 ?
      res.redirect('/newsupdates/success.html') :
      res.redirect('/newsupdates/fail.html'))
    .catch(err => console.log(err))
})

/*var options = {
"method": "GET",
"hostname": "corona-virus-world-and-india-data.p.rapidapi.com",
"port": null,
"path": "/api",
"headers": {
    "x-rapidapi-host": "corona-virus-world-and-india-data.p.rapidapi.com",
    "x-rapidapi-key": "9c6e1ba148mshbb87469eef4a471p140f66jsn7e00727e6331",
    "useQueryString": true
}
};

app.get('/', (req, res) => {
 console.log("hello")
    var req = http.request(options, function (res) {
        var chunks = [];
        console.log("data")
        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function () {
            var body = Buffer.concat(chunks);
            console.log(body.toString());
        });
    });

    req.end();
    console.log("end")
});
*/

app.get('/statewise', (req, res) => {
    
    /*var respose= ' '
    var body
    var options={
        host:'api.covid19api.com',
        port : 80,
        path:'/all',
        method:'GET'
    }

    var req = http.request(options, function (res) {
        var chunks = [];
        console.log("data")
        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function () {
             body = Buffer.concat(chunks);
            console.log(body.toString());
        });
    });

    req.end();
    console.log("end")
    res.send(body)*/

    /*WORKING HOSPITAL DATA
    axios({
        "method":"GET",
        "url":"https://api.rootnet.in/covid19-in/hospitals/medical-colleges",
        "headers":{
        "content-type":"application/octet-stream",
        "x-rapidapi-host":"coronavirus-tracker-india-covid-19.p.rapidapi.com",
        "x-rapidapi-key":"9c6e1ba148mshbb87469eef4a471p140f66jsn7e00727e6331",
        "useQueryString":true
        }
        })
        .then((response)=>{
          console.log(response.data.data.medicalColleges[0])
          //res.render("results",{candidateList: response.data});
        })
        .catch((error)=>{
          console.log(error)
        }) 
     WORKING HOSPITAL DATA   */


    /*WORKING EMERGENCY NUMBER
    axios({
        "method":"GET",
        "url":"https://api.rootnet.in/covid19-in/contacts",
        "headers":{
        "content-type":"application/octet-stream",
        "x-rapidapi-host":"coronavirus-tracker-india-covid-19.p.rapidapi.com",
        "x-rapidapi-key":"9c6e1ba148mshbb87469eef4a471p140f66jsn7e00727e6331",
        "useQueryString":true
        }
        })
        .then((response)=>{
          console.log(response.data.data.contacts.regional[0])
          //res.render("results",{candidateList: response.data});
        })
        .catch((error)=>{
          console.log(error)
        }) 
    WORKING EMERGENCY NUMBER*/
    
     //WORKING CASES COUNT
    axios({
        "method":"GET",
        "url":"https://coronavirus-tracker-india-covid-19.p.rapidapi.com/api/getStatewise",
        "headers":{
        "content-type":"application/octet-stream",
        "x-rapidapi-host":"coronavirus-tracker-india-covid-19.p.rapidapi.com",
        "x-rapidapi-key":"9c6e1ba148mshbb87469eef4a471p140f66jsn7e00727e6331",
        "useQueryString":true
        }
        })
        .then((response)=>{
          console.log(response.data[15].name)
          res.render("results",{candidateList: response.data});
        })
        .catch((error)=>{
          console.log(error)
        }) //WORKING
     })

app.get('/emergency',(req, res)=>{
  axios({
    "method":"GET",
    "url":"https://api.rootnet.in/covid19-in/contacts",
    "headers":{
    "content-type":"application/octet-stream",
    "x-rapidapi-host":"coronavirus-tracker-india-covid-19.p.rapidapi.com",
    "x-rapidapi-key":"9c6e1ba148mshbb87469eef4a471p140f66jsn7e00727e6331",
    "useQueryString":true
    }
    })
    .then((response)=>{
      console.log(response.data.data.contacts.regional[0])
      res.render("contacts",{candidateList: response.data.data.contacts.regional});
    })
    .catch((error)=>{
      console.log(error)
    }) 
})

app.get('/hospital',(req, res)=>{
  axios({
    "method":"GET",
    "url":"https://api.rootnet.in/covid19-in/hospitals/medical-colleges",
    "headers":{
    "content-type":"application/octet-stream",
    "x-rapidapi-host":"coronavirus-tracker-india-covid-19.p.rapidapi.com",
    "x-rapidapi-key":"9c6e1ba148mshbb87469eef4a471p140f66jsn7e00727e6331",
    "useQueryString":true
    }
    })
    .then((response)=>{
      console.log(response.data.data.medicalColleges[0])
      res.render("hospital",{candidateList: response.data.data.medicalColleges});
    })
    .catch((error)=>{
      console.log(error)
    }) 
})

app.get('/news',(req,res)=>{
  /*newsapi.v2.topHeadlines({
    sources: 'google-news',
    language: 'en',
  }).then(response => {
    console.log(response);
    res.render("news",{candidateList: response.articles});
    
     /* {
        status: "ok",
        articles: [...]
      }
    
   console.log(response)
  })
  .catch((error)=>{
    console.log(error)
  });
*/

//INDIAN API
  axios({
    "method":"GET",
    //"url":"https://timesofindia.indiatimes.com/rssfeeds/913168846.cms",
    "url":"http://newsapi.org/v2/top-headlines?country=in&apiKey=da5a2389155c443f8e00a9812ef591e7",
    "headers":{
    "content-type":"application/octet-stream",
    "x-rapidapi-host":"devru-times-of-india.p.rapidapi.com",
    "x-rapidapi-key":"9c6e1ba148mshbb87469eef4a471p140f66jsn7e00727e6331",
    "useQueryString":true
    },"params":{
    "feedtype":"sjson"
    }
    })
    .then((response)=>{
      console.log(response.data.articles)
      res.render("news",{candidateList: response.data.articles});
    })
    .catch((error)=>{
      console.log(error)
    })

/*axios({
  "method":"GET",
  //"url":"https://myallies-breaking-news-v1.p.rapidapi.com/GetTopNews",
  "url":"https://news.google.com"
  /*"headers":{
  "content-type":"application/octet-stream",
  "x-rapidapi-host":"myallies-breaking-news-v1.p.rapidapi.com",
  "x-rapidapi-key":"9c6e1ba148mshbb87469eef4a471p140f66jsn7e00727e6331",
  "useQueryString":true
  }
  }) .then((response)=>{
    console.log(response)
  })
  .catch((error)=>{
    console.log(error)
  })*/
 
})

app.get('/country',(req,res)=>{
  
  axios({
    "method":"GET",
    "url":"https://covid-19-coronavirus-statistics2.p.rapidapi.com/countriesData",
    "headers":{
    "content-type":"application/octet-stream",
    "x-rapidapi-host":"covid-19-coronavirus-statistics2.p.rapidapi.com",
    "x-rapidapi-key":"9c6e1ba148mshbb87469eef4a471p140f66jsn7e00727e6331",
    "useQueryString":true
    }
    })
    .then((response)=>{
      //console.log(response.data.result[0])
      res.render("country",{candidateList: response.data.result});
    })
    .catch((error)=>{
      console.log(error)
    })
  /*axios({
    "method":"GET",
    //"url":"https://timesofindia.indiatimes.com/rssfeeds/913168846.cms",
    "url":"https://corona-api.com/countries",
    //"url":"https://thevirustracker.com/free-api?global=stats",
    "headers":{
    "content-type":"application/octet-stream",
    "x-rapidapi-host":"devru-times-of-india.p.rapidapi.com",
    "x-rapidapi-key":"9c6e1ba148mshbb87469eef4a471p140f66jsn7e00727e6331",
    "useQueryString":true
    },"params":{
    "feedtype":"sjson"
    }
    })
    .then((response)=>{
      console.log(response.data.data)
      res.render("country",{candidateList: response.data.data});
    })
    .catch((error)=>{
      console.log(error)
    })*/
})

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log('Example app listening on port 8000!')
});

//response.data[15].name