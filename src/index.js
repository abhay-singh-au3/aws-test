import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import path from 'path';

import models, { sequelize } from './models';
import routes from './routes';

const app = express();

// Application-Level Middleware

app.use(cors());
app.use(express.static("build"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(async (req, res, next) => {
    req.context = {
        models,
    };
    next();
});

// Routes


app.use('/videos', routes.video);

app.get('*', (req, res) => {
    res.sendFile(path.resolve('build', 'index.html'))
})

// Start

sequelize.sync({ force: false }).then(async () => {
    app.listen(process.env.PORT, () =>
        console.log(`App listening on port ${process.env.PORT}!`),
    );
});