// Keep app.json identity/plugins; fail closed for native release API configuration.
module.exports = () => {
  const config = JSON.parse(JSON.stringify(require('./app.json').expo));
  const release = process.env.EAS_BUILD_PROFILE === 'production' || process.env.EAS_BUILD_PROFILE === 'aws-review' || process.env.LMS_AWS_REVIEW === '1';
  if (release) {
    const raw = process.env.EXPO_PUBLIC_API_URL;
    let url;
    try { url = new URL(raw || ''); } catch { throw new Error('Release builds require EXPO_PUBLIC_API_URL with an absolute HTTPS /api URL.'); }
    if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash ||
        !['/api', '/api/'].includes(url.pathname) ||
        ['localhost', '127.0.0.1', '10.0.2.2', '[::1]'].includes(url.hostname)) {
      throw new Error('Release API must use a device-reachable HTTPS /api URL without credentials, query or fragment.');
    }
    config.android = { ...config.android, usesCleartextTraffic: false };
  }
  return config;
};
