import { setupHome, showHome } from './home.js';
import { setupComments } from './comments.js';


const main = document.querySelector('main');
const homeSection = document.getElementById('postsSection');
const commentsSection = document.getElementById('commentsSection');
const formComments = document.querySelector('.answer-comment');

document.querySelector('nav a').addEventListener('click', () => {
    showHome();
})


document.getElementById('views').innerHTML = '';


setupHome(main, homeSection);
setupComments(main, commentsSection, formComments)
showHome();




