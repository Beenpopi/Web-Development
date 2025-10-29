const express = require('express');
const path = require('path')
const cookieParser = require('cookie-parser');
const { clear } = require('console');
const port=3030;

const app = express();
const router = express.Router();

router.get('/', (req, res) => {
    console.log("Request at " + req.url)
    res.sendFile(path.join(`${__dirname}/html/login.html`))
})


app.listen(port, () => {
    console.log(`Server listening on port: ${port}`)
})