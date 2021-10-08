const express = require('express');

const PORT = 2000;

const app = express();

app.get('*', (req, res) => {
    res.send('<h1>HELLO WORLD</h1>')
})


app.listen(PORT, () => console.log(`Server listening at port: ${PORT}`))
