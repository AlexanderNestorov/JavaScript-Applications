import {html} from '../../node_modules/lit-html/lit-html.js';

import {getRecentArticles} from '../api/data.js';


const homeTemplate = (js,py,java,c) => html`
<section id="home-page" class="content">
            <h1>Recent Articles</h1>
            <section class="recent js">
                ${js.length != 0
                ? js.map(articleTemplate)
                : html `<h2>JavaScript</h2>
                <h3 class = "no-articles">No articles yet</h3>`}
            </section>
            <section class="recent csharp">
            ${c.length != 0
                ? c.map(articleTemplate)
                : html `<h2>C#</h2>
                <h3 class = "no-articles">No articles yet</h3>`}
            </section>
            <section class="recent java">
            ${java.length != 0
                ? java.map(articleTemplate)
                : html `<h2>Java</h2>
                <h3 class = "no-articles">No articles yet</h3>`}
            </section>
            <section class="recent python">
            ${py.length != 0
                ? py.map(articleTemplate)
                : html `<h2>Python</h2>
                <h3 class = "no-articles">No articles yet</h3>`}
            </section>
        </section>
`;

const articleTemplate = (article) => html`
    <h2>${article.category}</h2>
    <article>
        <h3>${article.title}</h3>
        <p>${article.content}</p>
        <a href="/details/${article._id}" class="btn details-btn">Details</a>
    </article>
</section>
`;

export async function homePage(ctx) {

    const articles = await getRecentArticles();

    const js = articles.filter(article => article.category == "JavaScript");
    const py = articles.filter(article => article.category == "Python");
    const java = articles.filter(article => article.category == "Java");
    const c = articles.filter(article => article.category == "C#");

    ctx.render(homeTemplate(js,py,java,c));
}