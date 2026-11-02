import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import profileProgressHandler from './api/profile-progress.js';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'local-api-profile-progress',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url && req.url.startsWith('/api/profile-progress')) {
            const urlObj = new URL(req.url, 'http://localhost');
            const fakeReq = {
              method: req.method,
              query: Object.fromEntries(urlObj.searchParams.entries()),
              body: null,
            };
            const fakeRes = {
              statusCode: 200,
              setHeader(k, v) {
                res.setHeader(k, v);
              },
              status(code) {
                this.statusCode = code;
                return this;
              },
              json(data) {
                res.statusCode = this.statusCode;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
              },
            };
            try {
              await profileProgressHandler(fakeReq, fakeRes);
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, message: err.message }));
            }
            return;
          }
          next();
        });
      },
    },
  ],
  build: {
    target: 'esnext',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 650,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) {
              return 'vendor-framer';
            }
            if (id.includes('react-icons')) {
              return 'vendor-icons';
            }
            if (
              id.includes('react') ||
              id.includes('react-dom') ||
              id.includes('react-router-dom')
            ) {
              return 'vendor-react';
            }
            return 'vendor-utils';
          }
        },
      },
    },
  },
});
