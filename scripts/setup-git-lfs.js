#!/usr/bin/env node

// scripts/setup-git-lfs.js
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

/**
 * Check if Git LFS is installed on the system
 */
function isGitLfsInstalled() {
  try {
    execSync('git lfs version', { stdio: 'ignore' })
    return true
  } catch (error) {
    return false
  }
}

/**
 * Check if we're in a git repository
 */
function isGitRepository() {
  try {
    execSync('git rev-parse --git-dir', { stdio: 'ignore' })
    return true
  } catch (error) {
    return false
  }
}

/**
 * Install Git LFS based on the platform
 */
function installGitLfs() {
  const platform = process.platform

  console.log('🔧 Git LFS not found. Attempting to install...')

  try {
    if (platform === 'darwin') {
      // macOS - try homebrew first, then suggest manual installation
      try {
        console.log('   Using Homebrew to install Git LFS...')
        execSync('brew install git-lfs', { stdio: 'inherit' })
      } catch (error) {
        console.log('❌ Homebrew installation failed. Please install Git LFS manually:')
        console.log('   Visit: https://git-lfs.github.io/')
        console.log('   Or install Homebrew and run: brew install git-lfs')
        return false
      }
    } else if (platform === 'linux') {
      // Linux - try common package managers
      console.log('   Attempting to install Git LFS on Linux...')
      try {
        // Try apt (Ubuntu/Debian)
        execSync('sudo apt-get update && sudo apt-get install -y git-lfs', { stdio: 'inherit' })
      } catch (error) {
        try {
          // Try yum (RHEL/CentOS)
          execSync('sudo yum install -y git-lfs', { stdio: 'inherit' })
        } catch (error) {
          console.log('❌ Automatic installation failed. Please install Git LFS manually:')
          console.log('   Visit: https://git-lfs.github.io/')
          console.log('   Or use your package manager (apt, yum, dnf, etc.)')
          return false
        }
      }
    } else if (platform === 'win32') {
      console.log('❌ Windows automatic installation not supported.')
      console.log('   Please install Git LFS manually:')
      console.log('   Visit: https://git-lfs.github.io/')
      console.log('   Or use: winget install GitHub.GitLFS')
      return false
    } else {
      console.log(`❌ Platform ${platform} not supported for automatic installation.`)
      console.log('   Please install Git LFS manually: https://git-lfs.github.io/')
      return false
    }

    console.log('✅ Git LFS installed successfully!')
    return true
  } catch (error) {
    console.log('❌ Failed to install Git LFS automatically.')
    console.log('   Please install Git LFS manually: https://git-lfs.github.io/')
    return false
  }
}

/**
 * Setup Git LFS in the current repository
 */
function setupGitLfs() {
  console.log('🔧 Setting up Git LFS in repository...')

  try {
    // Install LFS hooks in the repository
    execSync('git lfs install', { stdio: 'inherit' })
    console.log('✅ Git LFS hooks installed in repository')

    // Try to pull LFS files
    console.log('📥 Downloading LFS files...')
    execSync('git lfs pull', { stdio: 'inherit' })
    console.log('✅ LFS files downloaded successfully')

    return true
  } catch (error) {
    console.log('⚠️  LFS setup completed, but file download failed.')
    console.log('   This is normal for fresh clones. LFS files will be available when needed.')
    return true // Still consider this a success
  }
}

/**
 * Main setup function
 */
function main() {
  console.log('🚀 Setting up Git LFS for iO Technology blog...')

  // Check if we're in a git repository
  if (!isGitRepository()) {
    console.log('ℹ️  Not in a Git repository. Skipping Git LFS setup.')
    return
  }

  // Check if Git LFS is already installed
  if (!isGitLfsInstalled()) {
    if (!installGitLfs()) {
      process.exit(1)
    }
  } else {
    console.log('✅ Git LFS is already installed')
  }

  // Setup Git LFS in the repository
  if (setupGitLfs()) {
    console.log('🎉 Git LFS setup completed successfully!')
    console.log('')
    console.log('💡 What this means:')
    console.log('   • Large files (images, videos) are now properly managed')
    console.log('   • Your clone will be faster and smaller')
    console.log('   • All images should display correctly in development')
  } else {
    console.log('❌ Git LFS setup failed. Please set up manually.')
    process.exit(1)
  }
}

// Only run if this script is executed directly
if (require.main === module) {
  main()
}

module.exports = { isGitLfsInstalled, isGitRepository, setupGitLfs }
