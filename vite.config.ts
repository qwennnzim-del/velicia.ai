
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, '.', '');
  
  const getEnvVar = (key: string) => {
    let val = process.env[key] || env[key] || "";
    // Remove surrounding quotes if user accidentally added them in Vercel
    if (val.startsWith('"') && val.endsWith('"')) {
      val = val.slice(1, -1);
    }
    if (val.startsWith("'") && val.endsWith("'")) {
      val = val.slice(1, -1);
    }
    return val;
  };

  const geminiKey = getEnvVar('GEMINI_API_KEY') || getEnvVar('VITE_GEMINI_API_KEY');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve('./'),
      },
    },
    define: {
      // Manual Polyfill untuk Env Vars agar aman diakses via process.env di browser
      'process.env.API_KEY': JSON.stringify(geminiKey), 
      'process.env.GEMINI_API_KEY': JSON.stringify(geminiKey),
      
      // Firebase Config Polyfills
      'process.env.VITE_FIREBASE_API_KEY': JSON.stringify(getEnvVar('VITE_FIREBASE_API_KEY')),
      'process.env.VITE_FIREBASE_AUTH_DOMAIN': JSON.stringify(getEnvVar('VITE_FIREBASE_AUTH_DOMAIN')),
      'process.env.VITE_FIREBASE_PROJECT_ID': JSON.stringify(getEnvVar('VITE_FIREBASE_PROJECT_ID')),
      'process.env.VITE_FIREBASE_STORAGE_BUCKET': JSON.stringify(getEnvVar('VITE_FIREBASE_STORAGE_BUCKET')),
      'process.env.VITE_FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID')),
      'process.env.VITE_FIREBASE_APP_ID': JSON.stringify(getEnvVar('VITE_FIREBASE_APP_ID')),
    }
  };
});
