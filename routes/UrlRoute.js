require('dotenv').config()
const express = require('express');
const { getClient } = require('../db/MongoClient');
const router = express.Router()

const { error } = require('../utils/Error');
const { generateUniqueId } = require('../utils/Helpers');

const validUrl = require('valid-url');


const checkIfUrlIsValid = (url) => {
    if (validUrl.isUri(url)) 
      return true;
    else return false;
};

const checkIfUrlExists = async (url) => {

    const client = await getClient();
    if(!client) return res.send(error('Internal Server Error',500))

    const findOriginalUrl = await client.collection('Urls').findOne({original_url:url});
    if (findOriginalUrl) {
        return { status : true,url: findOriginalUrl.short_url }
    } else return {status:false}
};


const createShortUrl = async (url) => {
    try {
      const id = await generateUniqueId();
      const shortUrl = `https://url-short-server.herokuapp.com/${id}`;
      // const shortUrl = `http://localhost:8000/${id}`;
      const newUrl = {
        original_url: url,
        short_url: shortUrl,
        generated_id: id,
        ts : new Date().getTime()
      }

        const client = await getClient();
        if(!client) return error('Internal Server Error',500)

        const insertUrl = await client.collection('Urls').insertOne(newUrl);
        if(insertUrl.insertedCount === 0) return error('Internal Server Error',500)

        return { status : true,shortUrl: shortUrl }

    } catch (error) {
      console.log(error);
      return error('Internal Server Error',500)
    }
};

const findUrl = async (urlId) => {

    const client = await getClient();
    if(!client) return res.send(error('Internal Server Error',500))

    const returnedUrl = await client.collection('Urls').findOne({generated_id:urlId});
    return returnedUrl
      ? {status : true, url : returnedUrl.original_url}
      : {status : false}
};


router.post('/shorten', async (req, res) => {
    
        console.log(req.body);
        const { url } = req.body;
    
        if (!url) return res.send(error('Please enter a valid url',400));
        if (!checkIfUrlIsValid(url)) return res.send(error('Please enter a a valid url',400));
    
        const urlExists = await checkIfUrlExists(url);
        if (urlExists.status) return res.send(urlExists);
    
        const shortUrl = await createShortUrl(url);
        if(shortUrl.status) return res.send({status : true, url : shortUrl.shortUrl});
        else return res.send(error('Internal Server Error',500))
    
});

router.get('/:urlId', async (req,res) => {
    const { urlId } = req.params;

    console.log(urlId);
    const url = await findUrl(urlId);
    if(url.status) return res.redirect(url.url);
    else return res.send(error('Not Found',404))
})

router.get('/', async (req, res) => {

    console.log('Called');
    const id = await generateUniqueId();

    return res.send({id})
})

module.exports = router;