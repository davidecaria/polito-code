import { Page, Block, User } from "./modelsFront";
const APIURL = 'http://localhost:3000/api';

async function listAllPages() {
    try {
        const response = await fetch(APIURL + '/allPages',{
            method : "GET",
            credentials: "include",
        });
        if (response.ok) {
            const pages = await response.json();
            return pages;
        } else {
            // if response is not OK
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error })
    }
}

async function listPubPages() {
    try {
        const response = await fetch(APIURL + '/publishedPages',{
            method : "GET",
            credentials: "include",
        });
        if (response.ok) {
            const pages = await response.json();
            return pages;
        } else {
            // if response is not OK
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error })
    }
}

async function listAllBlocks(pageId){

    try {
        const response = await fetch(APIURL + `/allPage/${pageId}/blocks`,{
            method : "GET",
            credentials: "include",
        });
        if (response.ok) {
            const blocks = await response.json();
            return blocks.map(b => new Block(b.blockId, b.pageId, b.position, b.type, b.content, b.imageId));
        } else {
            // if response is not OK
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error });
    }

}


/* APIs to modify a page */

async function modifyPage(pageId,title,author,publicationDate) {

    try {
        const response = await fetch(APIURL + `/page/${pageId}/modify`, {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                "title": title,
                "author": author,
                "publicationDate": publicationDate
            })
        });
        if (response.ok) {
            return response;
        } else {
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error });
    }
}

async function addPage(userId,title,author,creationDate,publicationDate) {

    try {
        const response = await fetch(APIURL + `/page/add`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                "user":userId,
                "title": title,
                "author": author,
                "creationDate": creationDate,
                "publicationDate": publicationDate
            })
        });
        if (response.ok) {
            const numPage = Number(await response.text());
            return numPage;
        } else {
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error });
    }
}

/* APIs to remove, modify or update a block */

// update blocks
async function updateBlocks(list) {

    try {
        const response = await fetch(APIURL + `/blocks/update`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                "list": list
            })
        });
        if (response.ok) {
            return true;
        } else {
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error });
    }
}

// add blocks
async function addBlocks(list) {

    try {
        const response = await fetch(APIURL + `/blocks/add`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                "list": list
            })
        });
        if (response.ok) {
            return true;
        } else {
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error });
    }
}

// delete blocks
async function deleteBlocks(list) {

    try {
        const response = await fetch(APIURL + `/blocks/delete`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                "list": list
            })
        });
        if (response.ok) {
            return true;
        } else {
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error });
    }
}

async function deletePage(pageId) {
    try {
        const response = await fetch(APIURL + `/page/delete`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                "pageId": pageId
            })
        });
        if (response.ok) {
            return true;
        } else {
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error});
    }
}

// update title
async function updateTitle(title) {
    try {
        const response = await fetch(APIURL + `/title/update`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                "title": title
            })
        });
        if (response.ok) {
            return true;
        } else {
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error });
    }
}

// get title
async function getTitle() {
    try {
        const response = await fetch(APIURL + '/title/getTitle',{
            method:'GET',
            credentials:'include',
        });
        if (response.ok) {
            const out = await response.json();
            return out;
        } else {
            // if response is not OK
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error })
    }
}


/* APIs to login and logout */

async function checkLogin(username, password) {
    try {
        const response = await fetch(APIURL + '/login', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        if (response.ok) {
            // const body = response.json();
            // console.log(body);
            // new User(body.userId,body.username,body.name,body.surname,body.type)
            return response.json();
        } else {
            const message = await response.text();
            throw new Error(/*response.statusText + " " + */message);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error });
    }
}

async function doLogout() {
    try {
        const response = await fetch(APIURL + '/logout', {
            method: 'POST',
        });
        if (response.ok) {
            return true ;
        } else {
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error });
    }
}

async function getUsers() {
    try {
        const response  = await fetch(APIURL + '/getAllUsers',{
            method:'GET',
            credentials:'include'
        } )
        if (response.ok) {
            const pages = await response.json();
            return pages;
        } else {
            // if response is not OK
            const msg = await response.text();
            throw new Error(response.statusText + " " + msg);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error })
    }
}



export { listAllPages, listPubPages, listAllBlocks, checkLogin, updateBlocks, addBlocks, deleteBlocks, modifyPage, addPage, doLogout, getUsers,deletePage,updateTitle,getTitle};