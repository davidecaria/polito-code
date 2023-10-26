'use strict';

const PORT = 3000;

const express = require('express');

//Middleware
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');

// passport
const passport = require('passport');
const LocalStrategy = require('passport-local');

const app = express();
app.use(morgan('combined'));
app.use(express.json());
app.use(cors(
    {
        origin: 'http://localhost:5173',
        credentials: true,
    }
));

const dao = require('./dao.js');
const { User, Page, Block, Image } = require('./models.js');
const dayjs = require('dayjs');


app.use(session({
    secret: 'pleaseGiveMe30', 
    resave: false, 
    saveUninitialized: false, 
    // cookie: {
    //     sameSite: 'none',
    //     secure: true
    // }
}));

passport.use(new LocalStrategy((username, password, callback) => {
    // verify function
    dao.getUser(username, password).then((user) => {
        callback(null, user);
    }).catch((err) => {
        callback(null, false, err);
    });
}));

passport.serializeUser((user, callback) => {
    callback(null, { userId: user.userId, type: user.type, username: user.username, name: user.name, surname: user.surname});
});
passport.deserializeUser((serializedUser, callback) => {
    callback(null, serializedUser);
});

//Store it into the session
app.use(passport.authenticate('session'));

// Custom middleware: artificial delay
function delay(req, res, next) {
    setTimeout(() => { next() }, 1000);
}

// Custom middleware: check login status
const isLogged = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(500).send("NOT AUTHENTICATED - GO AWAY");
    }
}

/* PUBLIC APIs no authentication neded */

// POST /api/login
app.post('/api/login', passport.authenticate('local'), (req, res) => {
    res.json(req.user);
});

// POST /api/logout
app.post('/api/logout', (req, res) => {
    req.logout(()=>{res.end()});
});

app.get('/api/publishedPages', (req, res) => {
    dao.getAllPublishedPages().then( (result) => {
        res.json(result);
    }).catch((error) => {
        res.status(500).send(error.message);
    });
});

app.get('/api/publishedPages/:pageId/blocks', async (req, res) => {
    const pageId = req.params.pageId;
    try {
        const blocks = await dao.getBlocksGivenPublishedPage(pageId);
        res.json(blocks);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/api/getAllUsers', (req,res) => {
    dao.getAllUsers().then((result) => {
        res.json(result);
    }).catch((error) => {
        res.status(500).send(error.message);
    })
});

// get title
app.get('/api/title/getTitle', (req, res) => {
    dao.getTitle().then((result) => {
        res.json(result);
    }).catch((error) => {
        res.status(500).send(error.message);
    });
});

app.use(isLogged);

/* PRIVATE APIs user is authenticated */

/* APIs to modify the page */

app.post('/api/page/:pageId/modify', async (req, res) => {

    const pageId = req.params.pageId;
    const bodyanswer = req.body;
    const title = bodyanswer.title;
    const author = bodyanswer.author;
    const publicationDate = bodyanswer.publicationDate;
    try {
        let stat = await dao.modifyPage(pageId,title,author,publicationDate);
        res.send(stat);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/api/page/add',async(req,res) => {
    const bodyanswer = req.body;
    const page = new Page(undefined, bodyanswer.title, bodyanswer.author,bodyanswer.userId,bodyanswer.creationDate, bodyanswer.publicationDate);
    try {
        let stat = await dao.createPage(page);
        console.log(stat);
        res.send(String(stat));
    } catch (error) {
        res.status(500).send(error.message);
    }

});

/* APIs to update, remove or delete blocks */

//update blocks
app.post('/api/blocks/update', async (req, res) => {

    const {list} = req.body;
    const castedList = [];
    for(const elem of list){
        castedList.push(new Block(elem.blockId,elem.pageId,elem.position,elem.type,elem.content,elem.imageId));
    }
    try {
        let stat = await dao.updateBlocks(castedList);
        res.send(stat);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// add blocks
app.post('/api/blocks/add', async (req, res) => {

    const {list} = req.body;
    const castedList = [];
    for(const elem of list){
        castedList.push(new Block(elem.blockId,elem.pageId,elem.position,elem.type,elem.content,elem.imageId));
    }
    try {
        let stat = await dao.addBlocks(castedList);
        res.send(stat);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// delete blocks
app.post('/api/blocks/delete', async (req, res) => {

    const {list} = req.body;
    const castedList = [];
    for(const elem of list){
        castedList.push(new Block(elem.blockId,elem.pageId,elem.position,elem.type,elem.content,elem.imageId));
    }
    try {
        let stat = await dao.deleteBlock(castedList);
        res.send(stat);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// delete page
app.post('/api/page/delete', async (req, res) => {
    const pageId = req.body.pageId;
    try {
        let stat = await dao.deletePage(pageId);
        res.send(stat);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/api/allPages', (req, res) => {

    dao.getAllPages().then( (result) => {
        res.json(result);
    }).catch((error) => {
        res.status(500).send(error.message);
    });
});

app.get('/api/allPage/:pageId/blocks', async (req, res) => {

    const pageId = req.params.pageId;
    try {
        const blocks = await dao.getBlocksGivenPage(pageId);
        res.json(blocks);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// update title
app.post('/api/title/update', async (req, res) => {
    const bodyanswer = req.body;
    const title = bodyanswer.title;
    try {
        let stat = await dao.updateTitle(title);
        res.send(stat);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


app.listen(PORT,
    () => { console.log(`Server started on http://localhost:${PORT}/`) });

