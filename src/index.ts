import puppeteer from 'puppeteer';
import path from 'path';
import fse from 'fs-extra';

async function start(urlToFetch: string) {
	/* 1 */
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	const identifier: string = Math.random().toString(36).substring(2, 11);

	/* 2 */
	page.on('response', (response): void => {
		const handler = async () => {
			const url = new URL(response.url());
			let filePath = path.resolve(`./output/${identifier}${url.pathname}`);
			if (path.extname(url.pathname).trim() === '') {
				filePath = `${filePath}/index.html`;
			}

			await fse.outputFile(filePath, await response.buffer());
		};
		handler().catch((e) => {
			console.error('handler() =>', e);
		});
	});

	/* 3 */
	await page.goto(urlToFetch, {
		waitUntil: 'networkidle2',
	});

	/* 4 */
	setTimeout(() => {
		const handler = async () => {
			await browser.close();
		};
		handler().catch((e) => {
			console.error('handler =>', e);
		});
	}, 60000 * 4);
}

start('https://campaign.hackbot.kr/#/prevention')
	.then(() => {
		console.log('finished');
	})
	.catch((e) => {
		console.error('start =>', e);
	});
