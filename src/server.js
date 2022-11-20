const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express()
const dotenv = require('dotenv');
dotenv.config();

const routes = require("./routes/index");

const port = process.env.PORT || 3000

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(routes);
app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded());  // to support Url Encoded Bodies

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})