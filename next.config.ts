import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  images:{
    remotePatterns:[
      {protocol: 'https', hostname: 'lh3.googleusercontent.com'}, //--구글 프로필 이미지 도메인 허용 설정
    ]
  },
};

export default nextConfig;
