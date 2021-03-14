const { chromium } = require('playwright-chromium');
const { expect } = require('chai');

let browser, page;
const host = 'http://localhost:3000';
const mockData = require('./mock-data.json');

function json(data) {
    return {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },

        body: JSON.stringify(data)
    };
}

describe('E2E tests', function () {
    this.timeout(30000);

    before(async () => {
        browser = await chromium.launch({ headless: true, slowMo: 2000 });
    });

    after(async () => {
        await browser.close();
    });

    beforeEach(async () => {
        page = await browser.newPage();
        await page.route('**/jsonstore/collections/books', route => route.fulfill(json(mockData.books)));
    });

    afterEach(async () => {
        await page.close();
    });

    describe('tests', () => {
        it('load all books', async () => {

            await page.goto(host);
            await page.click('text=Load all books');
            await page.waitForSelector('tbody');

            const books = await page.$$eval('td', td => td.map(t => t.textContent));
            expect(books.length).to.equal(6);
            expect(books[0]).to.contains('Harry Potter and the Philosopher\'s Stone');
            expect(books[1]).to.contains('J.K.Rowling');
            expect(books[2]).to.contains('Edit');
            expect(books[2]).to.contains('Delete');
            expect(books[3]).to.contains('C# Fundamentals');
            expect(books[4]).to.contains('Svetlin Nakov');
            expect(books[5]).to.contains('Edit');
            expect(books[5]).to.contains('Delete');

        });

        it('add book', async () => {
            await page.goto(host);
            await page.waitForSelector('#createForm');


            expect(async () => await page.click('#createForm button')).to.throw

            await page.fill('[name="title"]', 'book1');
            await page.fill('[name="author"]', 'author1');

            const [request] = await Promise.all([
                page.waitForRequest(request => request.url().includes('/jsonstore/collections/books') && request.method() == 'POST'),
                page.click('#createForm button')
            ]);

            const data = JSON.parse(request.postData());
            expect(data.title).to.equal('book1');
            expect(data.author).to.equal('author1');
        });

        it.only('edit functionality', async () => {
            await page.goto(host);
            await page.click('text=Load all books');
            await page.waitForSelector('td');
            await page.click('.editBtn');
            await page.waitForSelector('#editForm');

            const isVisible = await page.isVisible('#editForm');
            expect(isVisible).to.be.true;

            // const [title] = await page.$$eval('#editForm >> [name="title"]', (title) => title.map(v => v.value));
            // const [author] = await page.$$eval('#editForm >> [name="author"]', (author) => author.map(v => v.value));

            const title = await page.getAttribute('[name="title"]', 'value');
            const author = await page.getAttribute('[name="author"]', 'value');

            expect(title).to.equal('Harry Potter and the Philosopher\'s Stone');
            expect(author).to.equal('J.K.Rowling');

            await page.fill('#editForm >> [name="title"]', 'aaa');
            await page.fill('#editForm >> [name="author"]', 'bbb');

            const [request] = await Promise.all([
                page.waitForRequest(request => request.url().includes('jsonstore/collections/books/') && request.method() == 'PUT'),
                page.click('text=Save')
            ]);

            const data = JSON.parse(request.postData());

            expect(data.title).to.equal('aaa');
            expect(data.author).to.equal('bbb');

        });

        it('delete functionality', async () => {
            await page.goto(host);
            await page.click('text=Load all books');
            await page.waitForSelector('td');

            page.on('dialog', dialog => dialog.accept()) // поставя нещо като евент лисънър за диалог прозорци(демек alert)

            const [request] = await Promise.all([
                page.waitForRequest(request => request.url().includes('/jsonstore/collections/books/')),
                page.click('.deleteBtn')

            ]);

            expect(request.method()).to.equal('DELETE');
        })

    });

});


