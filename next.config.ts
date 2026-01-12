import type { NextConfig } from 'next';

export default {
  reactCompiler: true,
  allowedDevOrigins: [
    // Ngrok managed domains
    '*.ngrok.app',
    '*.ngrok.dev',
    '*.ngrok.pizza',
    '*.ngrok-free.app',
    '*.ngrok-free.dev',
    '*.ngrok-free.pizza',
    '*.ngrok.io',

    // tunnl.gg domain
    '*.tunnl.gg',
  ],
} satisfies NextConfig;
