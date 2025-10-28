#!/usr/bin/env node

// scripts/download-images-from-live.js
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const LIVE_SITE = 'https://techhub.iodigital.com'

/**
 * Download all images from the live site to replace LFS pointer files
 */
function downloadImagesFromLive() {
  console.log('🌐 Downloading images from live site...')
  console.log(`📍 Source: ${LIVE_SITE}`)

  try {
    // Get list of all LFS tracked image files
    const lfsFiles = execSync('git lfs ls-files', { encoding: 'utf8' })
      .split('\n')
      .filter((line) => line.trim())
      .map((line) => {
        // Extract filename from LFS output (format: "hash - filename")
        const match = line.match(/^\w+\s+-\s+(.+)$/)
        return match ? match[1] : null
      })
      .filter((filename) => filename)

    console.log(`📊 Found ${lfsFiles.length} LFS files to download`)

    let successCount = 0
    let failCount = 0
    const failedFiles = []

    // Download each file
    for (const file of lfsFiles) {
      const localPath = file
      const remotePath = `${LIVE_SITE}/${file}`

      // Ensure directory exists
      const dir = path.dirname(localPath)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }

      try {
        console.log(`⬇️  Downloading: ${file}`)

        // Use curl to download with proper error handling
        execSync(`curl -f -s -o "${localPath}" "${remotePath}"`, {
          stdio: 'pipe',
        })

        // Verify the file was downloaded and is not empty
        const stats = fs.statSync(localPath)
        if (stats.size > 100) {
          // Should be larger than LFS pointer (~130 bytes)
          successCount++

          // Quick verification for image files
          try {
            const fileType = execSync(`file "${localPath}"`, { encoding: 'utf8' })
            if (fileType.includes('image') || fileType.includes('SVG')) {
              console.log(`✅ ${file} (${stats.size} bytes)`)
            } else {
              console.log(`⚠️  ${file} (${stats.size} bytes) - might not be an image`)
            }
          } catch (e) {
            console.log(`✅ ${file} (${stats.size} bytes)`)
          }
        } else {
          throw new Error(`File too small: ${stats.size} bytes`)
        }
      } catch (error) {
        console.log(`❌ Failed: ${file}`)
        failCount++
        failedFiles.push(file)
      }
    }

    console.log(`\n📈 Download Summary:`)
    console.log(`✅ Success: ${successCount} files`)
    console.log(`❌ Failed: ${failCount} files`)

    if (failedFiles.length > 0) {
      console.log(`\n🔍 Failed files:`)
      failedFiles.forEach((file) => console.log(`   - ${file}`))
    }

    if (successCount > 0) {
      console.log(`\n🎉 Ready to continue with LFS removal!`)
      console.log(`   Run: file public/logo.png (should show image data now)`)
    }
  } catch (error) {
    console.error('❌ Error downloading images:', error.message)
    process.exit(1)
  }
}

// Only run if this script is executed directly
if (require.main === module) {
  downloadImagesFromLive()
}

module.exports = { downloadImagesFromLive }
