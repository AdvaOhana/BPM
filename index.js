const port = 6487;

const express = require("express");
const path = require('path');
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));


app.listen(port, () => {
    console.log(`Now listening on port http://localhost:${port}`);
})