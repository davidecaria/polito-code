'use strict';

import dayjs from "dayjs";


function Block(blockId, pageId, position, type , content, imageId){
    this.blockId = blockId;
    this.pageId = pageId;
    this.position = position;
    this.type = type;
    this.content = content;
    this.imageId = imageId;
}

function Page(pageId, title, author,userId,creationDate,publicationDate){
    this.pageId = pageId;
    this.title = title;
    this.author = author;
    this.userId = userId;
    this.creationDate = dayjs(creationDate).format('YYYY-MM-DD');
    this.publicationDate = dayjs(publicationDate).format('YYYY-MM-DD');
}

function User(userId,username,name,surname,type){
    this.userId = userId;
    this.username = username;
    this.name = name;
    this.surname = surname;
    this.type = type;
}

export { Page , Block, User};