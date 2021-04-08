//we import our required libraries
import { render } from '../node_modules/lit-html/lit-html.js';
import page from '../node_modules/page/page.mjs';

import { logout as apiLogout } from './api/data.js' 
import { catalogPage } from './views/catalog.js';
import { createPage } from './views/create.js';
import { detailsPage } from './views/details.js';
import { editPage } from './views/edit.js';
import { homePage } from './views/home.js';
import { loginPage } from './views/login.js';
import { profilePage } from './views/profile.js';
import { registerPage } from './views/register.js';


//we get our main element
const main = document.getElementById('site-content');

setUserNav();

document.getElementById('logoutBtn').addEventListener('click',logout);

// our "Routing Table"
page('/',decorateContext,homePage);
page('/login',decorateContext,loginPage);
page('/register',decorateContext,registerPage);
page('/catalog',decorateContext,catalogPage);
page('/create',decorateContext,createPage);
page('/details/:id',decorateContext,detailsPage);
page('/edit/:id',decorateContext,editPage);
page('/profile',decorateContext,profilePage);

// we launch our app
page.start();

// function guestUsersOnly(ctx,next) {
//     const token = sessionStorage.getItem('authToken');
//     if(token != null) {
//         return ctx.page.redirect('/catalog');
//     }

//     next();
// }

//initialize the 'middleware'
function decorateContext(ctx,next) {
    ctx.render = (content) => render(content, main);
    ctx.setUserNav = setUserNav;
    next();
};

// a function for the navigation to show content based on status(guest or user).
function setUserNav() {
    const username = sessionStorage.getItem('username');

    if(username != null) {
        document.getElementById('profName').textContent = `Welcome, ${username}`;
        document.getElementById('profile').style.display = '';
        document.getElementById('guest').style.display = 'none';
    } else {
        document.getElementById('profile').style.display = 'none';
        document.getElementById('guest').style.display = '';
    }
}

async function logout() {
    await apiLogout();

    setUserNav();

    page.redirect('/');
}
