import { bundleMDX } from 'mdx-bundler'
import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'
import readingTime from 'reading-time'

import getAllFilesRecursively from '../utils/files'
import type { FrontMatter } from '../../types'
import type { MDXContent, TableOfContents, ContentType } from './types'
import type { Result } from '../../types/api'
// Remark packages
import remarkGfm from 'remark-gfm'
import remarkFootnotes from 'remark-footnotes'
import remarkMath from 'remark-math'
import remarkExtractFrontmatter from '../remark-extract-frontmatter'
import remarkCodeTitles from '../remark-code-title'
import remarkTocHeadings from '../remark-toc-headings'
import remarkImgToJsx from '../remark-img-to-jsx'
// Rehype packages
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import rehypeCitation from 'rehype-citation'
import rehypePrismPlus from 'rehype-prism-plus'
import rehypePresetMinify from 'rehype-preset-minify'

const root = process.cwd()

// Enhanced version with better error handling
export function getFilesSafe(
  type: ContentType
): Result<string[], 'DIRECTORY_NOT_FOUND' | 'READ_ERROR'> {
  try {
    const prefixPaths = path.join(root, 'data', type)

    if (!fs.existsSync(prefixPaths)) {
      return { success: false, error: 'DIRECTORY_NOT_FOUND' }
    }

    const files = getAllFilesRecursively(prefixPaths)
    const processedFiles = files.map((file) =>
      file.slice(prefixPaths.length + 1).replace(/\\/g, '/')
    )

    return { success: true, data: processedFiles }
  } catch (error) {
    console.error('Error getting files:', error)
    return { success: false, error: 'READ_ERROR' }
  }
}

export function getFiles(type: ContentType): string[] {
  const prefixPaths = path.join(root, 'data', type)
  const files = getAllFilesRecursively(prefixPaths)
  // Only want to return blog/path and ignore root, replace is needed to work on Windows
  return files.map((file) => file.slice(prefixPaths.length + 1).replace(/\\/g, '/'))
}

export function formatSlug(slug: string): string {
  return slug.replace(/\.(mdx|md)/, '')
}

export function dateSortDesc(a: string, b: string): number {
  if (a > b) return -1
  if (a < b) return 1
  return 0
}

// Enhanced version with better error handling
export async function getFileBySlugSafe(
  type: ContentType,
  slug: string
): Promise<Result<MDXContent, 'FILE_NOT_FOUND' | 'PARSE_ERROR' | 'BUILD_ERROR'>> {
  try {
    const mdxPath = path.join(root, 'data', type, `${slug}.mdx`)
    const mdPath = path.join(root, 'data', type, `${slug}.md`)

    let source: string
    let fileName: string

    if (fs.existsSync(mdxPath)) {
      source = fs.readFileSync(mdxPath, 'utf8')
      fileName = `${slug}.mdx`
    } else if (fs.existsSync(mdPath)) {
      source = fs.readFileSync(mdPath, 'utf8')
      fileName = `${slug}.md`
    } else {
      return { success: false, error: 'FILE_NOT_FOUND' }
    }

    // Set up esbuild path
    if (process.platform === 'win32') {
      process.env.ESBUILD_BINARY_PATH = path.join(root, 'node_modules', 'esbuild', 'esbuild.exe')
    } else {
      process.env.ESBUILD_BINARY_PATH = path.join(root, 'node_modules', 'esbuild', 'bin', 'esbuild')
    }

    let toc: TableOfContents[] = []
    const tocRef = { current: toc }

    const { code, frontmatter } = await bundleMDX({
      source,
      cwd: path.join(root, 'components'),
      xdmOptions(options, _frontmatter) {
        options.remarkPlugins = [
          ...(options.remarkPlugins ?? []),
          remarkExtractFrontmatter as any,
          [remarkTocHeadings, { exportRef: tocRef }] as any,
          remarkGfm as any,
          remarkCodeTitles as any,
          [remarkFootnotes, { inlineNotes: true }] as any,
          remarkMath as any,
          remarkImgToJsx as any,
        ]
        options.rehypePlugins = [
          ...(options.rehypePlugins ?? []),
          rehypeSlug,
          rehypeAutolinkHeadings,
          rehypeKatex,
          [rehypeCitation, { path: path.join(root, 'data') }],
          [rehypePrismPlus, { ignoreMissing: true }],
          rehypePresetMinify,
        ]
        return options
      },
      esbuildOptions: (options) => {
        options.loader = {
          ...options.loader,
          '.js': 'jsx',
        }
        return options
      },
    })

    const contentStripped = source
      .replace(/(\r\n|\n|\r)/gm, '') // remove newlines to make regex below easier
      .replaceAll(new RegExp(/```.*?```/g), '') // remove codeblocks
      .replaceAll(new RegExp(/---.*?--/g), '') // remove frontmatter

    const result: MDXContent = {
      mdxSource: code,
      toc: tocRef.current,
      frontMatter: {
        readingTime: readingTime(contentStripped),
        slug: slug || null,
        fileName,
        ...frontmatter,
        date: frontmatter.date ? new Date(frontmatter.date).toISOString() : null,
      } as FrontMatter,
    }

    return { success: true, data: result }
  } catch (error) {
    console.error('Error processing MDX file:', error)
    if (error instanceof Error && error.message.includes('parse')) {
      return { success: false, error: 'PARSE_ERROR' }
    }
    return { success: false, error: 'BUILD_ERROR' }
  }
}

export async function getFileBySlug(type: ContentType, slug: string): Promise<MDXContent> {
  const mdxPath = path.join(root, 'data', type, `${slug}.mdx`)
  const mdPath = path.join(root, 'data', type, `${slug}.md`)
  const source = fs.existsSync(mdxPath)
    ? fs.readFileSync(mdxPath, 'utf8')
    : fs.readFileSync(mdPath, 'utf8')

  // https://github.com/kentcdodds/mdx-bundler#nextjs-esbuild-enoent
  if (process.platform === 'win32') {
    process.env.ESBUILD_BINARY_PATH = path.join(root, 'node_modules', 'esbuild', 'esbuild.exe')
  } else {
    process.env.ESBUILD_BINARY_PATH = path.join(root, 'node_modules', 'esbuild', 'bin', 'esbuild')
  }

  let toc: TableOfContents[] = []
  const tocRef = { current: toc }

  const { code, frontmatter } = await bundleMDX({
    source,
    // mdx imports can be automatically source from the components directory
    cwd: path.join(root, 'components'),
    xdmOptions(options, _frontmatter) {
      // this is the recommended way to add custom remark/rehype plugins:
      // The syntax might look weird, but it protects you in case we add/remove
      // plugins in the future.
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        remarkExtractFrontmatter as any,
        [remarkTocHeadings, { exportRef: tocRef }] as any,
        remarkGfm as any,
        remarkCodeTitles as any,
        [remarkFootnotes, { inlineNotes: true }] as any,
        remarkMath as any,
        remarkImgToJsx as any,
      ]
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeSlug,
        rehypeAutolinkHeadings,
        rehypeKatex,
        [rehypeCitation, { path: path.join(root, 'data') }],
        [rehypePrismPlus, { ignoreMissing: true }],
        rehypePresetMinify,
      ]
      return options
    },
    esbuildOptions: (options) => {
      options.loader = {
        ...options.loader,
        '.js': 'jsx',
      }
      return options
    },
  })

  const contentStripped = source
    .replace(/(\r\n|\n|\r)/gm, '') // remove newlines to make regex below easier
    .replaceAll(new RegExp(/```.*?```/g), '') // remove codeblocks
    .replaceAll(new RegExp(/---.*?--/g), '') // remove frontmatter

  return {
    mdxSource: code,
    toc: tocRef.current,
    frontMatter: {
      readingTime: readingTime(contentStripped),
      slug: slug || null,
      fileName: fs.existsSync(mdxPath) ? `${slug}.mdx` : `${slug}.md`,
      ...frontmatter,
      date: frontmatter.date ? new Date(frontmatter.date).toISOString() : null,
    } as FrontMatter,
  }
}

export async function getAllFilesFrontMatter(
  folder: ContentType,
  sortByProp: string = 'date'
): Promise<FrontMatter[]> {
  const prefixPaths = path.join(root, 'data', folder)

  const files = getAllFilesRecursively(prefixPaths)

  const allFrontMatter: FrontMatter[] = []

  files.forEach((file) => {
    // Replace is needed to work on Windows
    const fileName = file.slice(prefixPaths.length + 1).replace(/\\/g, '/')
    // Remove Unexpected File
    if (path.extname(fileName) !== '.md' && path.extname(fileName) !== '.mdx') {
      return
    }
    const source = fs.readFileSync(file, 'utf8')
    const stats = fs.statSync(file)

    const { data: frontmatter } = matter(source)
    if (frontmatter.draft !== true) {
      allFrontMatter.push({
        ...frontmatter,
        slug: formatSlug(fileName),
        date: frontmatter.date ? new Date(frontmatter.date).toISOString() : null,
        creationDate: new Date(stats.birthtime).toISOString(),
      } as FrontMatter)
    }
  })

  return allFrontMatter.sort((a, b) =>
    dateSortDesc(
      a[sortByProp as keyof FrontMatter] as string,
      b[sortByProp as keyof FrontMatter] as string
    )
  )
}
