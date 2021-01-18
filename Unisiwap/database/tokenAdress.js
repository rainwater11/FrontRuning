const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
const axios = require("axios")
const client = new MongoClient(url,{useUnifiedTopology: true})

const getData = async (pairID) => {

   

  response = response.data.data.tokenDayDatas;

  for (let i = 0; i < response.length; i++) {
    response[i] = {
      id: response[i].token.id,
      name: response[i].token.name
    }
  }

  return response

}

const dbInit = async () => {
  let data = await getData()
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("frontRun");
    dbo.collection("tokenWatchAddress").insertMany(data, function (err, res) {
      if (err) throw err;
      console.log("Number of documents inserted: " + res.insertedCount);
      db.close();
    });
  });
}

const dbClear = async () => {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("frontRun");
    var myquery = { id: /\w+/ };
    dbo.collection("tokenWatchAddress").deleteMany(myquery, function (err, obj) {
      if (err) throw err;
      console.log(obj.result.n + " document(s) deleted");
      db.close();
    });
  });
}

const dbRetrieve = async () => {
  try {
    await client.connect();
    let dbo =  client.db("frontRun");
    let collection =  dbo.collection("tokenWatchAddress")
    let ret = await collection.find({}, { projection: { _id: 0, id: 1 } }).toArray();
    return ret
  } finally {
    await client.close();
  }

}

const test = async () => {
  dbClear();
  dbInit();
}

// test()


module.exports = dbRetrieve;