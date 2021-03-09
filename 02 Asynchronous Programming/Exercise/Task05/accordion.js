const url = 'http://localhost:3030/jsonstore/advanced/articles/list';

let ITEMS;

function _renderItems(id, title) {

    let div = document.createElement('div');
    document.querySelector('#main').appendChild(div);
    div.className = 'accordion';
    div.innerHTML = `<div class="head">
                <span>${title}</span>
                <button class="button" id="${id}">More</button>
            </div>
            <div class="extra">
                <p>${title} .....</p>
            </div>`
}

async function _renderMore(tag) {
    tag.parentNode.parentNode.children[1].style.display = 'block';

    // if tag is load 1st time it will not load again-> use 1st value
    if (tag.parentNode.parentNode.children[1].children[0].textContent !== `${tag.parentNode.children[0].textContent} .....`) {
        return;
    }

    try {
        const promise = await fetch('http://localhost:3030/jsonstore/advanced/articles/details/' + tag.id);
        tag.parentNode.parentNode.children[1].children[0].textContent = (await promise.json()).content;

    } catch {
        alert("Error: server does not responce");
    }
}
async function _loadData() {
    try {
        const response = await fetch(url);
        ITEMS = await response.json();

        for (const item of ITEMS) {
            //   console.log(item);
            _renderItems(item._id, item.title);
        }
    } catch {
        alert('Error: server does not responce')
    }
}

function solution() {
    console.log('Loading')
    if (!ITEMS) {
        _loadData();
    }

    window.addEventListener('click', (e) => {

        switch (e.target.innerHTML) {
            case 'More':
                //   console.log(e.target.parentNode.parentNode.children[1].children[0]);
                e.target.innerHTML = 'Less';
                _renderMore(e.target);
                break;
            case 'Less':
                e.target.innerHTML = 'More';
                e.target.parentNode.parentNode.children[1].style.display = 'none';
                break;
        }
    })
}
solution();