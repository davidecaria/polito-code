'use strict';

// Get models for the db

const dayjs = require('dayjs');
const sqlite = require('sqlite3');
const crypto = require('crypto');

const { User, Page, Block, Image } = require('./models.js');

const db = new sqlite.Database('cms.sqlite', (err) => {
    if (err) throw err;
    // Enable foreign key support
    db.run('PRAGMA foreign_keys = ON;', (error) => {
        if (error) throw error;
    })
});

//Functions to interact with the db

/*
TO GET THE USER AND VALIDATE IT
*/
function getUser(username, password) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE username=?';
        db.get(sql, [username], (err, row) => {
            if (err) { // database error
                reject(err);
            } else {
                if (!row) { // non-existent user
                    reject('Invalid username or password');
                } else {
                    crypto.scrypt(password, row.salt, 32, (err, computed_hash) => {
                        if (err) { // key derivation fails
                            reject(err);
                        } else {
                            const equal = crypto.timingSafeEqual(computed_hash, Buffer.from(row.password, 'hex'));
                            if (equal) { // password ok
                                resolve(row);
                            } else { // password doesn't match
                                reject('Invalid username or password');
                            }
                        }
                    });
                }
            }
        });
    });
}


/*
FUNCTIONS PAGES, HEADER, PARAGRPAH, IMAGE
*/
function getAllPages(){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM pages';
        db.all(sql,(err,row) => {
            if(err) {
                reject(err);
            }else{
                const pages = row.map((p) => new Page(
                    p.pageId,
                    p.title,
                    p.author,
                    p.userId,
                    dayjs(p.creationDate),
                    dayjs(p.publicationDate),
                ));
                resolve(pages);
            }
        });
    });
}

function getAllPublishedPages(){
    const date = dayjs().format('YYYY-MM-DD');
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM pages WHERE publicationDate <= ?';
        db.all(sql,[date],(err,rows) => {
            if(err) {
                reject(err);
            }else{
                const pages = rows.map((p) => new Page(
                    p.pageId,
                    p.title,
                    p.author,
                    p.userId,
                    dayjs(p.creationDate),
                    dayjs(p.publicationDate),
                ));
                resolve(pages);
            }
        });
    });
}

function getBlocksGivenPage(id){
    return new Promise((resolve,reject) => {
        const sql = 'SELECT * FROM blocks WHERE pageId = ?'
        db.all(sql, [id], (err,row) => {
            if(err){
                reject(err);
            }else{
                const blocks = row.map((b) => new Block(
                    b.blockId,
                    b.pageId,
                    b.position,
                    b.type,
                    b.content,
                    b.imageId,
                ));
                resolve(blocks);
            }
        });
    });   
}

function getBlocksGivenPublishedPage(pageId){
    return new Promise((resolve,reject) => {
        const date = dayjs().format('YYYY-MM-DD HH:mm:ss');
        const sql = 'SELECT * FROM blocks, pages WHERE blocks.pageId == pages.pageId AND pages.publicationDate <= ? AND pages.pageId = ?';
        db.all(sql, [date, pageId], (err,row) => {
            if(err){
                reject(err);
            }else{
                const blocks = row.map((b) => new Block(
                    b.blockId,
                    b.pageId,
                    b.position,
                    b.type,
                    b.content,
                    b.imageId,
                ));
                resolve(blocks);
            }
        });
    });   
}

/*
CREATE PAGES, HEADER, PARAGRAPH, IMAGE
*/
function createPage(page){
    return new Promise((resolve,reject) => {
        const sql = 'INSERT INTO pages(title, author , userId, creationDate, publicationDate) VALUES(?,?,?,?,?)';
        db.run(
            sql,
            //Id is autoincremental
            [page.title,page.author,page.userId,page.creationDate,page.publicationDate],
            function(err) {
                if(err){
                    reject(err.message);
                }else{
                    resolve(this.lastID);
                }
            })
    });
}

function createBlock(block){
    return new Promise((resolve,reject) => {
        const sql = 'INSERT INTO blocks(pageId,position,type,content,imageId) VALUES(?,?,?,?,?)';
        db.run(
            sql,
            //Id is autoincremental
            [block.pageId,block.position,block.type,block.content,block.imageId],
            (err) => {
                if(err){
                    reject(err.message);
                }else{
                    resolve(true);
                }
            })
    });
}

//UPDATE PAGE
function modifyPage(pageId,title,author,publicationDate){
    return new Promise((resolve,reject) => {
        console.log(author);
        const sql = "UPDATE pages SET title = ?, author = ?, publicationDate = ? WHERE pageId = ?";
        db.run(sql, [title, author, publicationDate, pageId], (err) => {
            if (err){
                reject(err);
            }
            else {
                resolve(true);
            }
        });
    });
}

function deletePage(id){
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM pages WHERE pageId = ?';
        db.run(sql, [id], (err) => {
            if (err){
                reject(err);
            }
            else {
                resolve(true);
            }
        });
    });
}

// UPDATE TITLE
async function updateTitle(title) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE title SET title = ? WHERE titleId = 1';
        db.run(sql, [title], (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(true);
            }
        });
    });

};

function getTitle() {
    return new Promise((resolve, reject) => {
        const sql = "SELECT title FROM title WHERE titleId = 1";
        db.all(sql, [], (err, rows) => {
            if (err)
                reject(err)
            else {
                const title = rows.map((t) => t.title)[0];
                resolve(title);
            };
        });
    });
}

/*
UPADATING THE PAGES
*/
function updatePositions(position, blockId){
    return new Promise((resolve,reject) => {
        const sql = "UPDATE blocks SET position = ? WHERE blockId = ?";
        db.run(sql, [position, blockId], (err) => {
            if (err){
                reject(err);
            }
            else {
                resolve(true);
            }
        });
    });
}

function deletePage(id){
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM pages WHERE pageId = ?';
        db.run(sql, [id], (err) => {
            if (err){
                reject(err);
            }
            else {
                resolve(true);
            }
        });
    });
}

function deleteBlockGiveId(id){
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM blocks WHERE blockId = ?';
        db.run(sql, [id], (err) => {
            if (err){
                reject(err);
            }
            else {
                resolve(true);
            }
        });
    });
}

/*
UPDATE REMOVE OR DELETE BLOCKS
*/

async function updateBlocks(list) {
    return new Promise((resolve, reject) => {
        list.forEach((block) => {
            const sql = "UPDATE blocks SET position = ?, content = ? WHERE blockId = ?"
            db.run(sql,[block.position, block.content, block.blockId], (err) => {
                if(err){
                    reject(err);
                }else{
                    resolve(true);
                }
            })
        })
    });
}

async function addBlocks(list) {
    return new Promise((resolve, reject) => {
        list.forEach((block) => {
            // Perform operations on the element
            const sql = 'INSERT INTO blocks(pageId,position,type,content,imageId) VALUES (?,?,?,?,?)';
            db.run(sql, [block.pageId,block.position,block.type,block.content,block.imageId], (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(true);
                }
            });
        });

    });
}

async function deleteBlock(list) {
    return new Promise((resolve, reject) => {
        list.forEach((block) => {
            const sql = 'DELETE FROM blocks WHERE blockId = ?';
            db.run(sql, [block.blockId], (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(true);
                }
            });
        });
    });
}

/*
GET ALL THE USERS
*/

async function getAllUsers(){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users';
        db.all(sql,(err,row) => {
            if(err) {
                reject(err);
            }else{
                const users = row.map((u) => new User(
                    u.userId,
                    u.username,
                    u.type
                ));
                resolve(users);
            }
        });
    });
}



exports.getUser = getUser;
exports.getAllPublishedPages = getAllPublishedPages;
exports.getAllPages = getAllPages;
exports.getBlocksGivenPage = getBlocksGivenPage;
exports.createPage =  createPage;
exports.createBlock = createBlock;
exports.getBlocksGivenPublishedPage = getBlocksGivenPublishedPage;
exports.updatePositions = updatePositions;
exports.deletePage = deletePage;
exports.deleteBlockGiveId = deleteBlockGiveId;
exports.updateBlocks = updateBlocks;
exports.addBlocks = addBlocks;
exports.deleteBlock =deleteBlock;
exports.modifyPage = modifyPage;
exports.getAllUsers = getAllUsers;
exports.updateTitle = updateTitle;
exports.getTitle = getTitle;