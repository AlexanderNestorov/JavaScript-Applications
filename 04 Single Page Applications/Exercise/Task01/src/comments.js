import { e } from './dom.js';

async function getPostById(id) {
    const url = `http://localhost:3030/jsonstore/collections/myboard/posts/${id}`;
    const request = await fetch(url);
    const data = await request.json();

    return data;
}

async function getComments(id) {
    const url = 'http://localhost:3030/jsonstore/collections/myboard/comments';
    const request = await fetch(url);
    const data = await request.json();

    return Object.values(data).filter(c => c.commentId === id);
}

async function onSubmit(post) {
    const url = 'http://localhost:3030/jsonstore/collections/myboard/comments';
    await fetch(url, {
        method: 'post',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(post)
    });
}

function renderPost(data) {
    const element = e('div', { className: 'topic-title' },
        e('div', { className: 'topic-name-wrapper' },
            e('div', { className: 'topic-name' },
                e('h2', {}, `${data.topicName}`),
                e('p', {}, ['Date:', `${data.date}`])
            )
        )
    );
    return element;
}

function renderComments(data) {
    const element = e('div', { className: 'comment' },
        e('header', { className: 'header' },
            e('p', {}, [e('span', {}, `${data.username}`), 'posted on', e('time', {}, `${data.date}`)])
        ),
        e('div', { className: 'comment-main' },
            e('div', { className: 'userdetails' },
                e('img', { src: './static/profile.png', alt: 'avatar' })
            ),
            e('div', { className: 'post-content' },
                e('p', {}, `${data.postText}`)
            )
        )
    );

    return element;
}

let main;
let section;
let form;
let postId;

export function setupComments(mainTarget, sectionTarget, formComments) {
    main = mainTarget;
    section = sectionTarget;
    form = formComments;

    const formRef = section.querySelector('.commentsForm');
    formRef.addEventListener('submit', postComment);
}


function postComment(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const post = {
        'postText': formData.get('postText'),
        'username': formData.get('username'),
        commentId: postId
    }

    if (post.username === '' || post.postText === '') {
        return alert('All fields are required!');
    }

    onSubmit(post);

    document.getElementById('username').value = '';
    document.getElementById('comment').value = '';

    showComments(postId);

}

export async function showComments(id) {
    postId = id;
    const topicDiv = section.querySelector('.topic-content');
    topicDiv.innerHTML = '';
    main.innerHTML = '';
    main.appendChild(section);

    const post = await getPostById(id);
    const postElement = renderPost(post);

    topicDiv.appendChild(postElement);
    topicDiv.appendChild(form)

    const comments = await getComments(id);
    if (comments.length) {
        const commentsElements = comments.map(renderComments);
        commentsElements.forEach(c => topicDiv.appendChild(c));

    }


}

