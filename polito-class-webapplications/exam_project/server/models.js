'use string' ;

const dayjs = require('dayjs');

function User(userId,username,type,password){
    this.userId = userId;
    this.username = username;
    this.type = type;
}

function Page(pageId, title, author,userId,creationDate,publicationDate){
 this.pageId = pageId;
 this.title = title;
 this.author = author;
 this.userId = userId;
 this.creationDate = dayjs(creationDate).format('YYYY-MM-DD');
 this.publicationDate = dayjs(publicationDate).format('YYYY-MM-DD');
}

function Block(blockId, pageId, position, type , content, imageId){
    this.blockId = blockId;
    this.pageId = pageId;
    this.position = position;
    this.type = type;
    this.content = content;
    this.imageId = imageId;
}

function Image(imagePath,fileLocation){
    this.imagePath = imagePath;
    this.fileLocation = fileLocation;
}

exports.User = User;
exports.Page = Page;
exports.Block = Block;
exports.Image = Image;