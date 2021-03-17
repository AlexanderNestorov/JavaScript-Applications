import { html, render } from '../node_modules/lit-html/lit-html.js';
import { cats as catData } from './catSeeder.js';
// on app start:
// import CATS
// map CATS array to cat cards 
// render result

const catCardTemplate = (cat) => html`
<li>
    <img src="./images/${cat.imageLocation}.jpg" width="250" height="250" alt="Card image cap">
    <div class="info">
         <button @click=${toggleInfo} class="showBtn">Show status code</button>
         <div class="status" style="display: none" id="${cat.id}">
            <h4>Status Code: ${cat.statusCode}</h4>
            <p>${cat.statusMessage}</p>
         </div>
    </div>
</li>
`;

const main = document.getElementById('allCats');

const catsList = html`
<ul>
    ${catData.map(catCardTemplate)}
</ul>
`;

render(catsList,main);

function toggleInfo(event) {
    const element = event.target.parentNode.querySelector('.status');
    console.log(element);
    if(element.style.display == 'none') {
        element.removeAttribute('style');
        event.target.textContent = 'Hide status code';
    } else {
        element.style.display = 'none';
    }
}

