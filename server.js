const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dbService = require("./services/db");

const app = express();
const port = process.env.PORT || 80;
let server = null;

const usersComponent = require("./routes/users");
const productsComponent = require("./routes/products");
//const apiComponent = require('./routes/documentation');
const apiDoc = require("./reference/Web-interfaces-API.v1");

app.use(bodyParser.json());
app.use(cors());

app.use("/users", usersComponent);
app.use("/products", productsComponent);
//app.use('/apiDoc', apiComponent);

// This is an error handling middleware, the function has four parameters.
// See https://expressjs.com/en/guide/using-middleware.html#middleware.error-handling
app.use((err, req, res, next) => {
  if (err.hasOwnProperty("status") == true) {
    const date = new Date();
    console.error(date.toUTCString() + " - " + err.toString());
    console.error("Path attempted - " + req.path);

    res.status(err.status);
    res.json({
      reason: err.toString(),
    });
  } else {
    next();
  }
});

app.get("/apiDoc", function (req, res) {
  function getApiDoc(req, res, next) {
    res.json(apiDoc.getApiDoc());
  }
  res.json(apiDoc.getApiDoc());
});

/* Export a function to start and close the server for test purposes */
module.exports = {
  close: function () {
    server.close();
  },
  start: function (mode) {
    let databaseName = "db.sqlite"; // default database name
    if (mode == "test") {
      databaseName = "db.test.sqlite"; // test database name
    }
    dbService
      .init(databaseName)
      .then((result) => {
        server = app.listen(port, () => {
          console.log(`Example API listening on http://localhost:${port}\n`);
        });
      })
      .catch((error) => {
        console.log("DB init error");
        console.log(error);
      });
  },
};
