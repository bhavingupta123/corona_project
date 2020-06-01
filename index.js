const express = require('express')
const app = express();
const http = require('http')
const axios = require("axios");
const bodyparser = require('body-parser')
const NewsAPI = require('newsapi');
const path = require('path');
const fetch = require('node-fetch');
const mongoose = require('mongoose')

//artcle 1 start
const Article = require('./models/article')
const adminData = require('./models/admindata')
const newsleter = require('./models/newsletter')
const articleRouter = require('./routes/articles')
const methodOverride = require('method-override')
//require('dotenv').config();
require('dotenv').config()
var verify=0;
var total,deaths,recovered;


mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
})
.then(() => {
  console.log('MongoDB Connected')
})
.catch(err => console.log(err))

//artcle 1 end

let xmlParser = require('xml2json');
const newsapi = new NewsAPI(process.env.API_KEY1);

app.use(express.static(path.join(__dirname, 'views')));

app.set('views','views')
app.set('view engine','ejs')
app.use(express.urlencoded({ extended: false }))

var publicDir = require('path').join(__dirname,'/public')
app.use(express.static(publicDir))

app.use('/articles', articleRouter)

app.get('/',(req,res)=>{
  axios({
    "method":"GET",
    "url":"https://api.rootnet.in/covid19-in/stats/latest",
    })
    .then((response)=>{
      console.log(response.data.data.summary.total)
      total = response.data.data.summary.total
      deaths = response.data.data.summary.deaths
      recovered= response.data.data.summary.discharged
      res.render("home",{total:total,recovered:recovered,deaths:deaths});
    })
    .catch((error)=>{
      console.log(error)
    })
  
})


//article 2 start

//const Article1 = require('./../models/article')
const router = express.Router()

router.get('/new', (req, res) => {
  res.render('articles/new', { article: new Article() })
})

router.get('/edit/:id', async (req, res) => {
  const article = await Article.findById(req.params.id)
  res.render('articles/edit', { article: article })
})

router.get('/:slug', async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug })
  if (article == null) res.redirect('/articlehome')
  res.render('articles/show', { article: article })
})

router.post('/', async (req, res, next) => {
  req.article = new Article()
  next()
}, saveArticleAndRedirect('new'))

router.put('/:id', async (req, res, next) => {
  req.article = await Article.findById(req.params.id)
  next()
}, saveArticleAndRedirect('edit'))

router.delete('/:id', async (req, res) => {
  console.log("in delete")
  await Article.findByIdAndDelete(req.params.id)
  res.redirect('/articlehome')
})

function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let article = req.article
    article.title = req.body.title
    article.description = req.body.description
    article.markdown = req.body.markdown
    try {
      article = await article.save()
      res.redirect(`/articles/${article.slug}`)
    } catch (e) {
      res.render(`articles/${path}`, { article: article })
    }
  }
}


app.get('/admin',(req,res)=>{
  res.render('admin',{total:total,recovered:recovered,deaths:deaths})
})

app.post('/admin',(req,res)=>{
  var email = req.body.email;
  var password = req.body.password;
  console.log(email);
  console.log(password)


  adminData.findOne({email:email,password:password},function(err,founduser){
    if(err){
        res.send(err);
        console.log("error")
    }else{

        if(founduser)
        {   
          verify=1;
          console.log("found admin")
          
          res.redirect('/adminindex')
        }
        else
        {
          console.log("not found")
        }
        
    }
})

})

app.get('/articlehome', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })
  res.render('articles/index', { articles: articles ,total:total,recovered:recovered,deaths:deaths})
})

app.get('/travelguidelines',(req,res)=>{
  res.render('travel',{total:total,recovered:recovered,deaths:deaths})
})

app.get('/adminindex', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })
  if(verify==1)
  {
    verify=0;
    res.render('articles/adminindex', { articles: articles,total:total,recovered:recovered,deaths:deaths })
  }
  
})



//article 2 end

app.get('/signupnews',(req,res)=>{
  res.render('newsupdates/signupnews',{total:total,recovered:recovered,deaths:deaths})
})

app.post('/signupnews', (req, res) => {

  const firstName = req.body.firstName;
  const lastName= req.body.lastName;
  const email= req.body.email;
  const query1 = req.body.queries;

  console.log("query")
  console.log(query1)

  // Make sure fields are filled
  if (!firstName || !lastName || !email || !query1) {
    res.render('newsupdates/fail', {total:total,recovered:recovered,deaths:deaths });
    return;
  }

  newsleter.findOne({email:email},function(err,founduser){
    if(err){
        res.send(err);
    }else{
        if(founduser)
        {   
            console.log("bro already done candidate present")
            console.log(founduser);
            res.render('newsupdates/fail', { total:total,recovered:recovered,deaths:deaths })
        }

        else
        {
              var newUse = newsleter({
                firstName,
                lastName,
                email,
                query1
                });

                newUse.save(()=>{
                    console.log('done  created')
                    console.log(newUse)
                    res.render('newsupdates/success', {total:total,recovered:recovered,deaths:deaths })
                });   
  
        }
       
      }
  })

})

app.get('/statewise', (req, res) => {
    
     //WORKING CASES COUNT
    axios({
        "method":"GET",
        "url":"https://api.rootnet.in/covid19-in/stats/latest",
        })
        .then((response)=>{
          console.log(response.data.data.summary.total)
          /*total = response.data.data.summary.total
          deaths = response.data.data.summary.deaths
          recovered= response.data.data.summary.discharged*/
          res.render("results",{candidateList: response.data.data.regional,total:response.data.data.summary});
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
    "x-rapidapi-key":process.env.API_KEY2,
    "useQueryString":true
    }
    })
    .then((response)=>{
      console.log(response.data.data.contacts.regional[0])
      res.render("contacts",{candidateList: response.data.data.contacts.regional,total:total,recovered:recovered,deaths:deaths});
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
    "x-rapidapi-key":process.env.API_KEY3,
    "useQueryString":true
    }
    })
    .then((response)=>{
      console.log(response.data.data.medicalColleges[0])
      res.render("hospital",{candidateList: response.data.data.medicalColleges,total:total,recovered:recovered,deaths:deaths});
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
    "x-rapidapi-key":process.env.API_KEY4,
    "useQueryString":true
    },"params":{
    "feedtype":"sjson"
    }
    })
    .then((response)=>{
      console.log(response.data.articles)
      res.render("news",{candidateList: response.data.articles,total:total,recovered:recovered,deaths:deaths});
    })
    .catch((error)=>{
      console.log(error)
    })
 
})

app.get('/country',(req,res)=>{
  
  axios({
    "method":"GET",
    "url":"https://covid-19-coronavirus-statistics2.p.rapidapi.com/countriesData",
    "headers":{
    "content-type":"application/octet-stream",
    "x-rapidapi-host":"covid-19-coronavirus-statistics2.p.rapidapi.com",
    "x-rapidapi-key":process.env.API_KEY5,
    "useQueryString":true
    }
    })
    .then((response)=>{
      //console.log(response.data.result[0])
      res.render("country",{candidateList: response.data.result,total:total,recovered:recovered,deaths:deaths});
    })
    .catch((error)=>{
      console.log(error)
    })
 
})

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log('Example app listening on port 8000!')
});

//response.data[15].name