import '@testing-library/jest-dom';

// Mock de localStorage
const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    clear: vi.fn()
};

global.localStorage = localStorageMock;
