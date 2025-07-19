/** @type {import('next').NextConfig} */
const nextConfig = {
  // 핸드폰 접속을 위한 설정
  serverExternalPackages: [],
  // 모든 IP에서 접속 허용
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
  // 개발 서버 설정
  experimental: {
    // 핸드폰 접속을 위한 호스트 설정
    serverComponentsExternalPackages: [],
  },
};

module.exports = nextConfig; 