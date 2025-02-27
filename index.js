const port = 6487;

const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");

const swaggerAutogen = require("swagger-autogen")();
const swaggerUi = require("swagger-ui-express");

const swaggerOutputFile = "./swagger-output.json";
const routes = ["./Routers/*.js"];

const doc = {
    info: {
        title: "My API",
        description: "BPM",
    },
    host: `localhost:${port}`,
};

swaggerAutogen(swaggerOutputFile, routes, doc).then(() => {
    const swaggerDocument = require(swaggerOutputFile);
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(express.json());
    app.use(express.static(path.join(__dirname, "public")));

    let db_M = require("./database");
    global.db_pool = db_M.pool;

    app.use(express.static(path.join(__dirname, "View")));
    app.get("/", (req, res) => {
        res.status(200).sendFile(path.join(__dirname, "View/home.html"));
    });
    app.get("/patients", (req, res) => {
        res.status(200).sendFile(path.join(__dirname, "View/allusers.html"));
    });
    app.get("/measure", (req, res) => {
        res.status(200).sendFile(path.join(__dirname, "View/addMeasures.html"));
    });

    const measures_R = require("./Routers/measures_R");
    app.use("/", measures_R);

    const users_R = require("./Routers/users_R");
    app.use("/", users_R);

    app.listen(port, () => {
        console.log(`Now listening on port http://localhost:${port}`);
    });
});
