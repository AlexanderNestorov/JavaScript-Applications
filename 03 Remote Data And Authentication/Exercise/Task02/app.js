const url = 'http://localhost:3030/jsonstore/phonebook';
let contactBook = document.getElementById('phonebook');


async function _request(url, options) {
    try {
        const response = await fetch(url, options);
        return await response.json();
    } catch (err) {
        alert(`Error: ${err.message}`)
    }
}
async function load() {
    contactBook.innerHTML = '';

    const data = await _request(url);

    Object.keys(data)
        .forEach(contact => {
            //        console.log(contact)
            contactBook.appendChild(_e('li', `${data[contact].person}: ${data[contact].phone}`, data[contact]._id))
        })
}

function _e(type, text, id) {
    let temp = document.createElement(type);
    if (text) {
        temp.textContent = text;
    }
    if (id) {
        temp.id = id
    }
    const btnDEl = document.createElement('button');
    btnDEl.type = 'submit'
    btnDEl.textContent = 'DELETE';
    temp.appendChild(btnDEl);

    return temp;
}
async function create() {
    let [person, phone] = document.getElementsByTagName('input');

    if (person.value.trim() === '' || phone.value.trim() === '') {
        alert(`Error: all fields required`);
        return;
    }
    if (!phone.value.match(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g)) {
        alert(`Error: phone number format is not valid`);
        return;
    }


    const body = JSON.stringify({ person: `${person.value}`, phone: `${phone.value}` });
    let contact = await _request(url, {
        method: 'post',
        headers: {
            'Content-Type': 'aplication/json'
        },
        body
    });
    contactBook.appendChild(_e('li', `${contact.person}: ${contact.phone}`, contact._id))
    person.value = '';
    phone.value = '';
}

async function deleteCotanct(contactTag) {
    const removedContact = await _request(url + '/' + contactTag.id, {
        method: 'delete',
        // headers: {
        //     'Content-Type': 'aplication/json'
        // }
    })
    console.log(removedContact);
    load();
}

function attachEvents() {
    //   load();

    window.addEventListener('click', (e) => {
        switch (e.target.id) {
            case 'btnLoad':
                load();
                break;
            case 'btnCreate':
                create();
                break;
            default:
                if (e.target.tagName === 'BUTTON' && e.target.type === 'submit' && e.target.textContent === 'DELETE') {
                    deleteCotanct(e.target.parentNode);
                }

                break;
        }
    })


}

attachEvents();