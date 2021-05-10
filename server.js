const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(__dirname + '/dist/uparser-client'));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname + '/dist/dictionary/index.html'));
});

app.listen(process.env.PORT);
