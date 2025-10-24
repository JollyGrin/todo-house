const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  sw: 'sw.js',
})

/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = withPWA(nextConfig)