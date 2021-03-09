function solve() {

    const departBtn = document.getElementById('depart');
    const arriveBtn = document.getElementById('arrive');
    const banner = document.querySelector('#info span');

    let stop = {
        next: 'depot'
    };

    async function depart() {
        //request info about incoming stop
        const url = 'http://localhost:3030/jsonstore/bus/schedule/' + stop.next;
        const response = await fetch(url);
        const data = await response.json();
        stop = data;

        //update banner with stop className
        banner.textContent = `Next stop ${stop.name}`;
        //activate other button
        departBtn.disabled = true;
        arriveBtn.disabled = false;
    }

    function arrive() {
        //update banner to show arrival 
        banner.textContent = `Arriving at ${stop.name}`

        //activate other button
        departBtn.disabled = false;
        arriveBtn.disabled = true;
    }

    return {
        depart,
        arrive
    };
}

let result = solve();