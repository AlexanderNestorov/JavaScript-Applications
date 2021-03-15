// setup views
// setup nav links
// show appropriate header(navigation) based on user session
// start application in default view(home)


import { setupHome } from './views/home.js';
import { setupDetails } from './views/details.js';
import { setupLogin } from './views/login.js';
import { setupRegister } from './views/register.js';
import { setupCreate } from './views/create.js';
import { setupDashboard } from './views/dashboard.js';

const main = document.querySelector('main');
const nav = document.querySelector('nav');

const views = {};
const links = {};

const navigation = {
    goTo,
    setUserNav
};

registerView('home', document.getElementById('home-page'), setupHome, 'homeLink');
registerView('login', document.getElementById('login-page'), setupLogin, 'loginLink');
registerView('create', document.getElementById('create-page'), setupCreate, 'createLink');
registerView('register', document.getElementById('register-page'), setupRegister, 'registerLink');
registerView('details', document.getElementById('details-page'), setupDetails);
registerView('dashboard', document.getElementById('dashboard-holder'), setupDashboard, 'dashboardLink');

document.getElementById('views').remove();


setupNavigation();

//start app in home view
goTo('home')

function setupNavigation() {
    setUserNav()

    nav.addEventListener('click', (event) => {
        const viewName = links[event.target.id];
        if (viewName) {
            event.preventDefault();
            goTo(viewName);
        }
    })
}

function registerView(name, section, setup, linkId) {
    const view = setup(section, navigation);
    views[name] = view;

    if (linkId) {
        links[linkId] = name;
    }
}

async function goTo(name, ...params) {
    main.innerHTML = '';
    const view = views[name];
    const section = await view(...params);
    main.appendChild(section);
}

function setUserNav() {
    const token = sessionStorage.getItem('authToken');
    if (token != null) {
        [...nav.querySelectorAll('.user-nav')].forEach(e => e.style.display = 'list-item');
        [...nav.querySelectorAll('.guest-nav')].forEach(e => e.style.display = 'none');
    } else {
        [...nav.querySelectorAll('.user-nav')].forEach(e => e.style.display = 'none');
        [...nav.querySelectorAll('.guest-nav')].forEach(e => e.style.display = 'list-item');
    }
}