// scripts/download-lfs-images.js
const { execSync } = require('child_process')

if (process.env.NODE_ENV === 'production') {
  console.log('Downloading LFS files...')
  try {
    execSync('git lfs pull', { stdio: 'inherit' })
  } catch (error) {
    console.warn('LFS pull failed, using placeholder images')
  }
}
