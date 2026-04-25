import { env, exports } from 'cloudflare:workers';
import { createExecutionContext, waitOnExecutionContext } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src';

describe('cloud-mail worker', () => {
	it('routes API requests through the worker entrypoint', async () => {
		const request = new Request('http://example.com/api/init/not-the-secret');
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);

		expect(response.status).toBe(200);
		expect(await response.text()).toBe('❌ JWT secret mismatch');
	});

	it('serves the same API route through the worker export', async () => {
		const response = await exports.default.fetch('http://example.com/api/init/not-the-secret');

		expect(response.status).toBe(200);
		expect(await response.text()).toBe('❌ JWT secret mismatch');
	});
});
