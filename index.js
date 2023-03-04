
import express, { response } from 'express';
import axios from 'axios';
import cheerio from 'cheerio';
const port = process.env.PORT ||8000;

const app = express();

// array of newspapers

const newspapers = [
    {
        name: 'the times',
        address: 'https://www.thetimes.co.uk/environment/climate-change',
        base:''
    },
    {
        name :'the telegraph',
        address:'https://www.telegraph.co.uk/climate-change/',
        base:'https://www.telegraph.co.uk'
    },
    {
        name:'the guardian',
        address:'https://www.theguardian.com/environment/climate-crisis',
        base:''
    },
    {
        name:'the nation',
        address:'https://mwnation.com/climate-change/',
        base:'https://mwnation.com/'
    },
    {
        name:'sunday times',
        address:'https://times.mw/tag/malawi-floods/',
        base:'' 
    },

    {
        name:'nyasa times',
        address:'https://www.nyasatimes.com/climate-change/',
        base:'' 
    },
    {
        name:'nippon paint holdings',
        address:'https://www.nipponpaint-holdings.com/en/sustainability/environment/climatechange/',
        base:'https://www.nipponpaint-holdings.com'  
    },

    {
        name:' Council on Foreign Relations',
        address:'https://www.cfr.org/backgrounder/china-climate-change-policies-environmental-degradation',
        base:''
    }



]




// list of articles
const articles = [];


// looping through newspapers
newspapers.forEach(newspaper =>{

    axios.get(newspaper.address)
    .then(response => {
        const html = response.data;
        const $ = cheerio.load(html)
        $("a:contains('climate')",html).each(function () {
            const title = $(this).text();
            const url = $(this).attr('href');
            articles.push({
                title,
                url:newspaper.base +url,
                source:newspaper.name
            }) 
         })

    })

})

// routes
app.get('/',(req,res)=>{
    res.json('Welcome to Climate news API')
})

app.get('/news',(req,res)=>{
res.json(articles)
})

// getting specific newspaper
app.get('/news/:newspaperId',(req,res)=>{
const newspaperId= req.params.newspaperId;
const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
//console.log(newspaperAddress);

const newspaperBase = newspapers.filter(newspaper =>newspaper.name ==newspaperId)[0].base
axios.get(newspaperAddress)
.then(response =>{
    const html = response.data;
    const $ = cheerio.load(html);
    const specificArticles = [];
    $('a:contains("climate")',html).each(function () {
       const title= $(this).text()
       const url = $(this).attr('href')
       specificArticles.push({
        title,
        url:newspaperBase + url,
        source:newspaperId
       })

    })
    res.json(specificArticles)
}).catch(error =>{
    console.log('====================================');
    console.log(error);
    console.log('====================================');
})
})
app.listen(port,()=>{
    console.log(`server running on http://localhost:${port}`)
})

module.exports = app;