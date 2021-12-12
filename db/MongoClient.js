require('dotenv').config()
const {MongoClient} = require('mongodb')
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASSWORD
// const url = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000";
const url = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.itq58.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

let client = new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true,})
const connectDb = async() => {

    console.log('Connecting To Database...');

    try {
        await client.connect()
        await client.db('Url-Shortner').command({ping : 1})

        console.log('--- Database Connected ---');
        return true

    } catch (e) {
        console.log(e);
        return false
    }

}
const getClient = async() => {

    if(!client)
        await connectDb()
    
    try{
        await client.db('Url-Shortner').command({ping : 1})
    } catch (e) {
        await connectDb()
        try{
            await client.db('Url-Shortner').command({ping : 1})
        } catch(e) {return null}
    }

    return client.db('Url-Shortner')

}



module.exports.getClient = getClient
module.exports.connectDb = connectDb