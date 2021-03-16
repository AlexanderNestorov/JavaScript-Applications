// we import the template tool
import {render} from './node_modules/lit-html/lit-html.js';
// import the insertion data
import { contacts } from './contacts.js';
// import the actual template
import cardTemplate from './card.js';

//container for the data
const container = document.getElementById('contacts');
//map the data to the templates
const result = contacts.map(cardTemplate);
//show the result
render(result, container);
