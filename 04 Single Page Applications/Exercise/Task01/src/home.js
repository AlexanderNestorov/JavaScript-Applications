import { showComments } from './comments.js';
import { e } from './dom.js';

async function getTopics() {
    const url = 'http://localhost:3030/jsonstore/collections/myboard/posts';
    const request = await fetch(url);
    const data = await request.json();

    return Object.values(data);
}

function renderTopic(data) {
    const element = e('div', { className: 'topic-container' },
        e('div', { className: 'topic-name-wrapper' },
            e('div', { className: 'topic-name' },
                e('a', { href: '#', onClick: () => showComments(data._id), className: 'normal' },
                    e('h2', {}, `${data.topicName}`)),
                e('div', { className: 'columns' },
                    e('div', {},
                        e('p', {}, ['Date:', e('time', {}, `${data.date}`)]),
                        e('div', { className: 'nick-name' },
                            e('p', {}, ['Username:', e('span', {}, ` ${data.username}`)])
                        )
                    )
                )
            )
        )
    )

    return element;
}

async function onSubmit(post) {
    const url = 'http://localhost:3030/jsonstore/collections/myboard/posts';
    const response = await fetch(url, {
        method: 'post',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(post)
    });

}

let main;
let section;

export function setupHome(mainTarget, sectionTarget) {
    main = mainTarget;
    section = sectionTarget;

    section.querySelector('.cancel').addEventListener('click', clearFields);
    section.querySelector('.public').addEventListener('click', postTopic);

    function postTopic(event) {
        event.preventDefault();
        const date = new Date();

        const formData = new FormData(event.target.parentNode.parentNode);

        const post = {
            'topicName': formData.get('topicName'),
            'username': formData.get('username'),
            'postText': formData.get('postText'),
            date
        }

        if (post.topicName === '' || post.username === '' || post.postText === '') {
            return alert('All fields are required!');
        }

        onSubmit(post);

        document.getElementById('topicName').value = '';
        document.getElementById('username').value = '';
        document.getElementById('postText').value = '';
        showHome()
    }

    function clearFields(event) {
        event.preventDefault();
        document.getElementById('topicName').value = '';
        document.getElementById('username').value = '';
        document.getElementById('postText').value = '';
    }

}


export async function showHome() {
    const topicDiv = section.querySelector('.topic-title')
    topicDiv.innerHTML = '';
    main.innerHTML = '';
    main.appendChild(section);

    const posts = await getTopics();
    const postsElements = posts.map(renderTopic);

    const fragment = document.createDocumentFragment();
    postsElements.forEach(p => {
        fragment.appendChild(p);
    });
    topicDiv.appendChild(fragment);
}

