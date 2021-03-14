const { chromium } = require('playwright-chromium');
const { expect } = require('chai');

let browser, page;
const mockData = require('./mock-data.json');
const host = 'http://localhost:3000';

function json(data) {
    return {
        status: 200,
        headers: {
            // 'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },

        body: JSON.stringify(data)
    };
}

describe('E2E tests', function () {
    this.timeout(60000);

    before(async () => {
        browser = await chromium.launch({ headless: true, slowMo: 500 });
    });

    after(async () => {
        await browser.close();
    });

    beforeEach(async () => {
        page = await browser.newPage();
    });

    afterEach(async () => {
        await page.close();
    });

    describe('tests', () => {
        it('refresh button', async () => {
            await page.goto(host);
            await page.click('#refresh');

            const [text] = await page.$$eval('#messages', (textarea) => textarea.map(t => t.value));

            expect(text).includes('Spami: Hello, are you there?');
            expect(text).includes('Garry: Yep, whats up :?');
            expect(text).includes('Spami: How are you? Long time no see? :)');
            expect(text).includes('George: Hello, guys! :))');
            expect(text).includes('Spami: Hello, George nice to see you! :)))');

        });

        it('send button', async () => {
            const name = 'test';
            const msg = 'test message'
            await page.goto(host);

            await page.fill('#author', name);
            await page.fill('#content', msg);

            const [request] = await Promise.all([
                page.waitForRequest(request => request.url().includes('/jsonstore/messenger') && request.method() === 'POST'),
                page.click('#submit')

            ]);

            const data = JSON.parse(request.postData());
            expect(data.author).to.equal(name);
            expect(data.content).to.equal(msg);
        });
    })


});