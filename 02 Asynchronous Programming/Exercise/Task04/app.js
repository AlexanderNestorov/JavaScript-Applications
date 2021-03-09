const url = 'http://localhost:3030/jsonstore/advanced/profiles';
let main = document.querySelector('#main');

// All users data
let USER_DATA;

function _renderProfileDiv(username, email, age) {
    let div = document.createElement('div');
    div.className = 'profile';
    main.appendChild(div);
    div.innerHTML = `<img src="./iconProfile2.png" class="userIcon" />
<label>Lock</label>
<input type="radio" name="user1Locked" value="lock" checked>
<label>Unlock</label>
<input type="radio" name="user1Locked" value="unlock"><br>
<hr>
<label>Username</label>
<input type="text" name="user1Username" value="${username}" disabled readonly />
<div id="user1HiddenFields">
<hr>
<label>Email:</label>
<input type="email" name="user1Email" value="${email}" disabled readonly />
<label>Age:</label>
<input type="email" name="user1Age" value="${age}" disabled readonly />
</div>
<button>Show more</button>`;
}

function _displayError(text) {
    alert(text);
}
async function loadData() {
    try {
        const response = await fetch(url);
        USER_DATA = await response.json();

        main.innerHTML = '';
        for (const id in USER_DATA) {
            const user = (USER_DATA[id]);
            _renderProfileDiv(user.username, user.email, user.age);
        }
    } catch {
        _displayError("Server not responce");
    }
}

function lockedProfile() {
    if (!USER_DATA) {
        loadData();
    }
    console.log('Loading');

    window.addEventListener('click', (e) => {

        switch (e.target.innerHTML) {
            case 'Show more':
                if (!e.target.parentNode.children[4].checked) {
                    console.log('Profile is Locked');
                    return;
                }
                e.target.parentNode.children[9].style.display = 'block';
                e.target.textContent = 'Hide it';
                break;
            case 'Hide it':
                console.log('point Hide')
                if (!e.target.parentNode.children[4].checked) {
                    console.log('Profile is Locked');
                    return;
                }
                e.target.parentNode.children[9].style.display = 'none';
                e.target.textContent = 'Show more';
                break;
        }
    })

}