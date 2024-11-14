/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
      config.module.rules.push({
        test: /pdf\.worker\.js$/,
        use: { loader: 'worker-loader' },
      });
  
      return config;
    },
  };
  
  export default nextConfig;
  