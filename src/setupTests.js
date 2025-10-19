import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock del localStorage
const localStorageMock = {
    store: {},
    getItem(key) {
        return this.store[key] || null
    },
    setItem(key, value) {
        this.store[key] = value.toString()
    },
    removeItem(key) {
        delete this.store[key]
    },
    clear() {
        this.store = {}
    }
}

// Configurar el mock del localStorage
Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
})

// Limpiar localStorage antes de cada prueba
beforeEach(() => {
    window.localStorage.clear()
})

// Mock de fetch para pruebas
global.fetch = vi.fn()

// Restaurar todos los mocks después de cada prueba
afterEach(() => {
    vi.clearAllMocks()
})
