import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
	cleanup();
});

class ResizeObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
}
(globalThis as any).ResizeObserver = ResizeObserver;
