import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'

// Clean up DOM after each test
if (typeof globalThis.afterEach === 'function') {
  globalThis.afterEach(() => {
    cleanup()
    localStorage.clear()
    sessionStorage.clear()
  })
}

// Polyfill window.matchMedia for JSDOM
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => {},
    }),
  })
}
