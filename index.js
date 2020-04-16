require("dotenv").config();

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const mongodb = require("mongodb");
const MongoClient = require("mongodb").MongoClient;

const PORT = process.env.PORT || 8080;

app.use(express.static("./public/"));

app.get("/", (req, res) => {
  res.redirect("index.html");
});

app.get("/createABookmark", (req, res) => {
  res.redirect("./html/createBookmarks.html");
});

app.get("/createATag", (req, res) => {
  res.redirect("./html/createTags.html");
});

const uri = process.env.mongo_conn;

app.post("/createTag", (req, res) => {
  let { name } = req.body;
  let timeCreated = new Date().getTime();
  let timeUpdated = timeCreated;

  let insertObject = {
    name,
    timeCreated,
    timeUpdated,
  };

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  client.connect((err, client) => {
    if (err) throw err;
    console.log("connected correctly");

    const db = client.db("backendassignment");
    const col = db.collection("tags");
    col.insertOne(insertObject, (err, result) => {
      if (err) throw err;

      console.log("inserted");
      res.redirect("./html/createTags.html?status=success");
      client.close();
      console.log("client closed");
    });
  });
});

app.get("/getTags", (req, res) => {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  client.connect((err, client) => {
    if (err) throw err;
    console.log("connected correctly");
    const db = client.db("backendassignment");
    const col = db.collection("tags");

    col.find().toArray((err, docs) => {
      res.json(docs);
      client.close();
      console.log("client closed");
    });
  });
});

app.post("/createBookmark", (req, res) => {
  let { link } = req.body;
  let { title } = req.body;
  let { publisher } = req.body;
  let tags = req.body.tagsArray;

  let timeCreated = new Date().getTime();
  let timeUpdated = timeCreated;

  let insertObject = {
    link,
    title,
    timeCreated,
    timeUpdated,
    publisher,
    tags,
  };

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  client.connect((err, client) => {
    if (err) throw err;
    console.log("connected correctly");

    const db = client.db("backendassignment");
    const col = db.collection("bookmarks");
    col.insertOne(insertObject, (err, result) => {
      if (err) throw err;

      console.log("inserted");
      client.close();
      console.log("client closed");
    });
  });
  res.json({ status: "success" });
});

app.get("/getBookmarks", (req, res) => {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  client.connect((err, client) => {
    if (err) throw err;
    console.log("connected correctly");
    const db = client.db("backendassignment");
    const col = db.collection("bookmarks");

    col.find().toArray((err, docs) => {
      if (err) throw err;
      res.json(docs);
      client.close();
      console.log("client closed");
    });
  });
});

app.post("/deleteTags", (req, res) => {
  const { id } = req.body;
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  client.connect((err, client) => {
    if (err) throw err;
    console.log("connected correctly");
    const db = client.db("backendassignment");
    const col = db.collection("tags");

    col.deleteOne({ _id: new mongodb.ObjectID(id) }, (err, result) => {
      if (err) throw err;

      client.close();
      console.log("client closed");
      res.json({ status: "success" });
    });
  });
});

app.post("/deleteBookmarks", (req, res) => {
  const { id } = req.body;
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  client.connect((err, client) => {
    if (err) throw err;
    console.log("connected correctly");
    const db = client.db("backendassignment");
    const col = db.collection("bookmarks");

    col.deleteOne({ _id: new mongodb.ObjectID(id) }, (err, result) => {
      if (err) throw err;

      client.close();
      console.log("client closed");
      res.json({ status: "success" });
    });
  });
});

app.post("/deleteTagsFromBookmarks", (req, res) => {
  let { name, id } = req.body;

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  client.connect((err, client) => {
    if (err) throw err;
    console.log("connected correctly");
    const db = client.db("backendassignment");
    const col = db.collection("bookmarks");

    col.findOneAndUpdate(
      { _id: new mongodb.ObjectID(id) },
      { $pull: { tags: name } },
      (err, result) => {
        if (err) throw err;

        client.close();
        console.log("client closed");
        res.json({ status: "success" });
      }
    );
  });
});

app.post("/addTagToBookmarks", (req, res) => {
  let { id, newTag } = req.body;

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  client.connect((err, client) => {
    if (err) throw err;
    console.log("connected correctly");
    const db = client.db("backendassignment");
    const col = db.collection("bookmarks");

    col.findOneAndUpdate(
      { _id: new mongodb.ObjectID(id) },
      { $push: { tags: newTag } },
      (err, result) => {
        if (err) throw err;

        client.close();
        console.log("client closed");
        res.json({ status: "success" });
      }
    );
  });
});

app.post("/createTagWith", (req, res) => {
  let { name } = req.body;
  let timeCreated = new Date().getTime();
  let timeUpdated = timeCreated;

  let insertObject = {
    name,
    timeCreated,
    timeUpdated,
  };

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  client.connect((err, client) => {
    if (err) throw err;
    console.log("connected correctly");

    const db = client.db("backendassignment");
    const col = db.collection("tags");
    col.insertOne(insertObject, (err, result) => {
      if (err) throw err;

      console.log("inserted");
      client.close();
      console.log("client closed");
    });
  });

  res.json({ status: "success" });
});

app.listen(PORT, () => {
  console.log(`listening at ${PORT}`);
});
