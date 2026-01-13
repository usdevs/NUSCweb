import { withPayload } from '@payloadcms/next/withPayload';
import type { NextConfig } from 'next';

const nextConfig = {
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

export default withPayload(nextConfig);
