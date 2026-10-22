import { readFileSync } from 'node:fs';
import { URL } from 'node:url';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { createTestHarness } from 'wrangler';

const font = readFileSync(
	new URL('../test/fixtures/noto-sans-jp-test.ttf', import.meta.url),
);
const fontCssUrl =
	'https://fonts.googleapis.com/css2?family=Noto%20Sans%20JP:wght@100&subset=latin';
const fontUrl = 'https://fonts.gstatic.com/test/noto-sans-jp.ttf';
const emojiUrl =
	'https://raw.githubusercontent.com/twitter/twemoji/v14.0.2/assets/svg/1f43c.svg';

const server = createTestHarness({
	workers: [{ configPath: './wrangler.toml' }],
});

describe('Worker', () => {
	beforeAll(async () => {
		await server.listen();
	});

	afterAll(async () => {
		await server.close();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('returns a cacheable PNG image without external network access', async () => {
		const requestedUrls: string[] = [];
		vi.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
			const request = new Request(input, init);
			requestedUrls.push(request.url);

			switch (request.url) {
				case fontCssUrl:
					return new Response(`@font-face { src: url(${fontUrl}) format('truetype'); }`);
				case fontUrl:
					return new Response(Uint8Array.from(font));
				case emojiUrl:
					return new Response(
						'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">' +
						'<circle cx="18" cy="18" r="16" fill="black"/></svg>',
					);
				default:
					throw new Error(`Unexpected outbound request: ${request.url}`);
			}
		});

		const response = await server.getWorker().fetch('/?msg=Hello%20%F0%9F%90%BC');
		const image = new Uint8Array(await response.arrayBuffer());

		expect(response.status).toBe(200);
		expect(response.headers.get('cache-control')).toBe('max-age=604800');
		expect(Array.from(image.slice(0, 8))).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
		expect(requestedUrls).toEqual(expect.arrayContaining([fontCssUrl, fontUrl, emojiUrl]));
	});
});
