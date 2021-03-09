async function crud(url, options) {
    const response = await fetch(url, options);
    if (response.ok != true) {
        let error = await response.json();
        alert(error.message);
        return;
    }
    const result = await response.json();
    return result;
}

function attachEvents() {
    if (document.getElementById('register') != null) {
        document.getElementById('register').addEventListener('submit', registerUser);
        document.getElementById('login').addEventListener('submit', loginUser);
    } else if (sessionStorage.authToken != null) {
        document.getElementById('addBtn').disabled = false;
        document.getElementById('addBtn').addEventListener('click', addNew);
        document.getElementById('logout').style.display = 'block';
        document.getElementById('login').style.display = 'none';
        document.getElementById('logout').addEventListener('click', logout);
        document.getElementById('catches').addEventListener('click', (e) => {
            console.log(e);
            if (e.target.tagName == 'BUTTON' && e.target.innerText == "DELETE") {
                deleteCurrent(e);
            } else if (e.target.tagName == 'BUTTON' && e.target.innerText == "UPDATE") {
                updateCurrent(e);
            }
        })
    }
    document.getElementById('load').addEventListener('click', loadAll);
}
attachEvents();

async function registerUser(e) {
    e.preventDefault();
    const form = new FormData(document.getElementById('register'));
    let email = form.get('email');
    let password = form.get('password');
    let rePass = form.get('rePass');
    if (email.trim() == '' || password.trim() == '' || rePass.trim() == '') {
        alert('Something went wrong !');
        return;
    }
    if (password != rePass) {
        alert('The passwords do not match!');
        return;
    }
    const answer = await crud('http://localhost:3030/users/register', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    let token = answer.accessToken;
    sessionStorage.setItem('authToken', token);
    sessionStorage.setItem('userId', answer._id);
    document.getElementById('addBtn').disabled = false;
}
async function loginUser(e) {
    e.preventDefault();
    const form = new FormData(document.getElementById('login'));
    let email = form.get('email');
    let password = form.get('password');
    if (email.trim() == '' || password.trim() == '') {
        alert('Something went wrong!');
        return;
    }
    const answer = await crud('http://localhost:3030/users/login', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    let token = answer.accessToken;
    sessionStorage.setItem('authToken', token);
    sessionStorage.setItem('userId', answer._id);
    alert('You are now logged! But the redirect is missing :/');
    document.getElementById('addBtn').disabled = false;
}
async function logout(e) {
    e.preventDefault();
    let token = sessionStorage.getItem('authToken');
    await fetch('http://localhost:3030/users/logout', {
        method: 'GET',
        headers: { "X-Authorization": token }
    });

    document.getElementById('logout').style.display = 'none';
    document.getElementById('login').style.display = 'block';
    sessionStorage.clear();
    document.getElementById('addBtn').disabled = true;
}
async function loadAll() {
    let data = await crud('http://localhost:3030/data/catches');
    let div = document.getElementById('catches');
    div.innerHTML = '';
    if (sessionStorage.authToken != null) {
        Object.values(data).map((current) => {
            let result = makeUnlogedDiv(current);
            div.innerHTML += result;
        })
    } else {
        Object.values(data).map((current) => {
            let result = makeLogedDiv(current);
            div.innerHTML += result;
        })
    }
}
function makeLogedDiv(current) {
    let element = ` 
    <div class="catch">
        <label>Angler</label>
        <input type="text" class="angler" value="${current.angler}" />
        <hr>
        <label>Weight</label>
        <input type="number" class="weight" value="${current.weight}" />
        <hr>
        <label>Species</label>
        <input type="text" class="species" value="${current.species}" />
        <hr>
        <label>Location</label>
        <input type="text" class="location" value="${current.location}" />
        <hr>
        <label>Bait</label>
        <input type="text" class="bait" value="${current.bait}" />
        <hr>
        <label>Capture Time</label>
        <input type="number" class="captureTime" value="${current.captureTime}" />
        <hr>
        <button  disabled class="update" id="${current._id}">Update</button>
        <button  disabled class="delete" id="${current._id}" >Delete</button>
    </div>`
    return element;
}
function makeUnlogedDiv(current) {
    let element = ` 
    <div class="catch">
        <label>Angler</label>
        <input type="text" class="angler" value="${current.angler}" />
        <hr>
        <label>Weight</label>
        <input type="number" class="weight" value="${current.weight}" />
        <hr>
        <label>Species</label>
        <input type="text" class="species" value="${current.species}" />
        <hr>
        <label>Location</label>
        <input type="text" class="location" value="${current.location}" />
        <hr>
        <label>Bait</label>
        <input type="text" class="bait" value="${current.bait}" />
        <hr>
        <label>Capture Time</label>
        <input type="number" class="captureTime" value="${current.captureTime}" />
        <hr>
        <button  class="update" id="${current._id}" >Update</button>
        <button  class="delete" id="${current._id}" >Delete</button>
    </div>`
    return element;
}
async function addNew(e) {
    let token = sessionStorage.getItem('authToken');
    let inputForm = document.getElementById('addForm').children;
    let angler = inputForm[2].value;
    let weight = inputForm[4].value;
    let species = inputForm[6].value;
    let location = inputForm[8].value;
    let bait = inputForm[10].value;
    let captureTime = inputForm[12].value;
    if (angler.trim() == '' || weight.trim() == ''
        || species.trim() == '' || location.trim() == ''
        || bait.trim() == '' || captureTime.trim() == '') {
        alert("All fields are requierd!");
    } else {
        let current = {
            "angler": angler, "weight": weight,
            "species": species, "location": location, "bait": bait, "captureTime": captureTime
        }
        await crud('http://localhost:3030/data/catches', {
            method: "POST",
            headers: { "X-Authorization": token, "Content-Type": "application/json" },
            body: JSON.stringify(current)
        })
        inputForm[2].value = '';
        inputForm[4] = '';
        inputForm[6] = '';
        inputForm[8] = '';
        inputForm[10] = '';
        inputForm[12] = '';
        loadAll();
    }
}
async function deleteCurrent(e) {
    let token = sessionStorage.getItem('authToken');
    await crud('http://localhost:3030/data/catches/' + e.target.id, {
        method: "DELETE",
        headers: { "X-Authorization": token, "Content-Type": "application/json" },
    })
    loadAll();
}
async function updateCurrent(e) {
    let token = sessionStorage.getItem('authToken');
    let inputForm = e.target.parentNode.children;
    let angler = inputForm[1].value;
    let weight = inputForm[4].value;
    let species = inputForm[7].value;
    let location = inputForm[10].value;
    let bait = inputForm[13].value;
    let captureTime = inputForm[16].value;
    if (angler.trim() == '' || weight.trim() == ''
        || species.trim() == '' || location.trim() == ''
        || bait.trim() == '' || captureTime.trim() == '') {
        alert("All fields are requierd!");
    } else {
        let current = {
            "angler": angler, "weight": weight,
            "species": species, "location": location, "bait": bait, "captureTime": captureTime
        }
        await crud('http://localhost:3030/data/catches/' + e.target.id, {
            method: "PUT",
            headers: { "X-Authorization": token, "Content-Type": "application/json" },
            body: JSON.stringify(current)
        })
        loadAll();
    }
}