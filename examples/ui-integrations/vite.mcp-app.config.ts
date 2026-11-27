import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { defineConfig } from 'vite-plus';

// MCP App は 1 枚の HTML として渡り、ホストの既定の CSP は外の script も
// style も通さない。React も ui の CSS も、その HTML の中に入れる
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  publicDir: false,
  build: {
    cssTarget: ['chrome146', 'edge146', 'firefox151', 'safari26'],
    outDir: 'dist/mcp-app',
    rollupOptions: { input: 'mcp-app.html' },
  },
});
