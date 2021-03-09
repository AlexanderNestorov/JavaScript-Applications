// input field -> get value
let input = document.querySelector('#location');

// the button
const btn = document.querySelector('#submit');

// append result(render)
let forecast = document.querySelector('#forecast');

// icon Template
const icon = {
    'Sunny': '☀', // '&#x2600', //
    'Partly sunny': '⛅', // '&#x26C5', //
    'Overcast': '☁', //'&#x2601', //
    'Rain': '☂', //'&#x2614', //
    'Degrees': '°', //'&#176', //
}

//  after 1st request, safe data for next checks.Type: Object {name: name, code:code}-> code will use with next 2 GET requests
let locations;


// template for request and render
let renderQUEST = [{
        name: "Currnet Condition",
        url: 'http://localhost:3030/jsonstore/forecaster/today/',
        render: (data) => {
            forecast.children[0].appendChild(_createTag('div', false, 'forecasts', [
                _createTag('span', icon[data.forecast.condition], 'condition symbol'),
                _createTag('span', null, 'condition', [
                    _createTag('span', data.name, 'forecast-data'),
                    _createTag('span', `${data.forecast.low}${icon.Degrees}/${data.forecast.high}${icon.Degrees}`, 'forecast-data'),
                    _createTag('span', data.forecast.condition, 'forecast-data')
                ])
            ]));
        }
    },

    {
        name: "Three-Day Forecast",
        url: 'http://localhost:3030/jsonstore/forecaster/upcoming/',
        render: (data) => {
            let div2 = _createTag('div', false, 'forecast-info');
            forecast.children[1].appendChild(div2);
            for (const day of data.forecast) {
                div2.appendChild(_createTag('span', null, 'upcoming', [
                    _createTag('span', icon[day.condition], 'symbol'),
                    _createTag('span', `${day.low}${icon.Degrees}/${day.high}${icon.Degrees}`, 'forecast-data'),
                    _createTag('span', day.condition, 'forecast-data')
                ]));
            }
        }
    }
];

// create Tag template, with textContent and className + appendChild(Array)
function _createTag(type, text, clazz, children) {
    let temp = document.createElement(type);
    if (text) {
        temp.textContent = text;
    }
    if (clazz) {
        temp.className = clazz;
    }
    if (children) {
        children.forEach(child => temp.appendChild(child));
    }
    return temp;
}


//display Error
function displayError(text) {
    alert(text);
}


function attachEvents() {
    btn.addEventListener('click', onClick);

}

attachEvents();

async function onClick() {

    if (!locations) {
        console.log("Make Get request to the server")
        try {
            const promise = await fetch('http://localhost:3030/jsonstore/forecaster/locations');
            locations = await promise.json();
        } catch {
            displayError('No connection to Data Base');
        }
    }

    let index;

    for (const location of locations) {
        if (location.name.toLowerCase() === input.value.trim().toLowerCase()) {
            index = locations.indexOf(location);
            break;
        }
    }
    console.log(index)

    if (index === undefined) {
        displayError('Town not Found');
        return;
    }
    if (forecast.children[0].children[1]) {
        forecast.children[0].children[1].remove();
        forecast.children[1].children[1].remove();
    }
    forecast.style.display = 'block';

    // forEach the request : Tday and 3-days
    for (const request of renderQUEST) {
        try {
            const response = await fetch(request.url + locations[index].code);
            const data = await response.json();
            request.render(data);

        } catch {
            displayError(`${request.name} server does not responce`);
        }
    }
    input.value = '';
}