import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['./test/**/*.{test,spec}.ts'],
    globals: true,
    setupFiles: ['./test/setup.ts'],
  },
})
