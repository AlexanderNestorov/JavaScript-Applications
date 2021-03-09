const url = 'http://localhost:3030/jsonstore/messenger'
let msgShape = document.getElementById('messages');

async function request(url, option) {
    try {
        const responce = await fetch(url, option);
        return await responce.json();
    } catch (err) {
        alert(`Error: ${err.message}`);
    }

}
async function refresh() {
    msgShape.textContent = '';
    let data = await request(url);

    Object.keys(data)
        .forEach(msg => {
            msgShape.textContent += `${data[msg].author}: ${data[msg].content}\n`;
        })
}
async function onSubmit() {
    if (document.getElementsByName('author')[0].value.trim() === '' ||
        document.getElementsByName('content')[0].value.trim() === '') {
        alert('Name and Message required');
        return;
    }
    const body = JSON.stringify({
        author: `${document.getElementsByName('author')[0].value}`,
        content: `${document.getElementsByName('content')[0].value}`
    });

    await request(url, {
        method: 'post',
        headers: {
            'Content-Type': 'aplication/json'
        },
        body
    });
    refresh();
document.getElementsByName('author')[0].value = '';
document.getElementsByName('content')[0].value = '';
}

function attachEvents() {
    refresh();
    document.getElementById('submit').addEventListener('click', onSubmit);

    document.getElementById('refresh').addEventListener('click', refresh);
}

attachEvents();