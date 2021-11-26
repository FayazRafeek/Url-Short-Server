const {getClient} = require('../db/MongoClient');
const { error } = require('./Error');

const generateUniqueId = async() => {
    
    const generatedId = Math.random().toString(32).substr(2, 8);

    const client = await getClient()

    if(!client) return error('Couldn\'t connect to MongoDB',500);

    const collection = client.collection('Urls');

    const result = await collection.findOne({short_id: generatedId});

    if(result) return generateUniqueId();

    return generatedId;
}

module.exports.generateUniqueId = generateUniqueId;