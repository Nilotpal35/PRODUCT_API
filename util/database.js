const { MongoClient, ServerApiVersion } = require("mongodb");


const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    depricationError: true,
  },
});

let _db;

const run = async (cb) => {
  try {
    await client.connect();
    _db = await client.db("shop").command({ ping: 1 });
    console.log("~MONGO DB SERVER CONNECTED~");
    cb();
  } finally {
    await client.close();
  }
};

const MongoConnect = (cb) => {
  run(cb).catch((err) => {
    console.log("Some issue in connection!", err);
    throw err;
  });
};

const getDb = () => {
  if (_db) {
    return _db;
  } else {
    console.log("No Database Connected!");
  }
};

exports.MongoConnect = MongoConnect;
exports.getDb = getDb;
