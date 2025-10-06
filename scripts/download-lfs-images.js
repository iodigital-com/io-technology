// scripts/download-lfs-images.js
const { execSync } = require('child_process')
const { isGitLfsInstalled, isGitRepository } = require('./setup-git-lfs')

/**
 * Download LFS files for production builds
 * This script ensures LFS files are available during build time
 */
function downloadLfsFiles() {
  console.log('📥 Checking for LFS files...')

  // Check if we're in a git repository
  if (!isGitRepository()) {
    console.log('ℹ️  Not in a Git repository. Skipping LFS file download.')
    return
  }

  // Check if Git LFS is installed
  if (!isGitLfsInstalled()) {
    console.warn('⚠️  Git LFS not installed. Some images may not be available.')
    console.warn('   Run "npm run setup:lfs" to install and configure Git LFS.')
    return
  }

  console.log('📥 Downloading LFS files...')
  try {
    execSync('git lfs pull', { stdio: 'inherit' })
    console.log('✅ LFS files downloaded successfully')
  } catch (error) {
    console.warn('⚠️  LFS pull failed. Some images may not be available.')
    console.warn('   Error:', error.message)
    console.warn('   This might be normal if LFS files are not yet available.')
  }
}

// Run in production or when explicitly requested
if (process.env.NODE_ENV === 'production' || process.argv.includes('--force')) {
  downloadLfsFiles()
}

module.exports = { downloadLfsFiles }
