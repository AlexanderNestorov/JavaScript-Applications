import { html, render } from '../node_modules/lit-html/lit-html.js'

// data -> list
const listTemplate = (data) => html`
<ul>
   ${data.map(t => html`<li>${t}</li>`)}
</ul>
`;

document.getElementById('btnLoadTowns').addEventListener('click', updateList)

function updateList(event) {
    event.preventDefault();
    //parse input 
    const townsAsString = document.getElementById('towns').value;
    const towns = townsAsString.split(',').map(x => x.trim());
    const root = document.getElementById('root');
    // execute template
    const result = listTemplate(towns);
    //render result
    render(result, root);
    //clear input 
}