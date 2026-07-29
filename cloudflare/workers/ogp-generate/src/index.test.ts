import { unstable_dev } from 'wrangler';
import type { UnstableDevWorker } from 'wrangler';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Worker', () => {
	let worker: UnstableDevWorker;

	beforeAll(async () => {
		worker = await unstable_dev('src/index.ts', {
			experimental: { disableExperimentalWarning: true },
		});
	});

	afterAll(async () => {
		await worker.stop();
	});

	it('returns a cacheable PNG image', async () => {
		const response = await worker.fetch('/?msg=Hello');
		const image = new Uint8Array(await response.arrayBuffer());

		expect(response.status).toBe(200);
		expect(response.headers.get('cache-control')).toBe('max-age=604800');
		expect(Array.from(image.slice(0, 8))).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
	});
});
