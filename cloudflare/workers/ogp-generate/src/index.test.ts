import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createTestHarness } from 'wrangler';

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

	it('returns a cacheable PNG image', async () => {
		const response = await server.fetch('/?msg=Hello%20%F0%9F%90%BC');
		const image = new Uint8Array(await response.arrayBuffer());

		expect(response.status).toBe(200);
		expect(response.headers.get('cache-control')).toBe('max-age=604800');
		expect(Array.from(image.slice(0, 8))).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
	});
});
