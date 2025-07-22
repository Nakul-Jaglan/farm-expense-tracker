import nextPwa from 'next-pwa';

const isDev = process.env.NODE_ENV === 'development';

const withPWA = nextPwa({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: isDev,
});

const nextConfig = {};

export default withPWA(nextConfig);
