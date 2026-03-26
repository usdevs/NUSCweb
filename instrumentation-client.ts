import posthog from 'posthog-js';

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  defaults: '2025-05-24',
  loaded: function (ph) {
    if (process.env.NODE_ENV === 'development') {
      ph.opt_out_capturing();
    }
  },
});
