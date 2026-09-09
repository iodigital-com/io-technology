# iO TechHub

![iO logo](/public/io.svg)

> **Want to contribute an article?** Check out our [contribution guide](data/contribute/contribute.mdx) to see how!

## About

iO TechHub is the technology blog platform for [iO](https://www.iodigital.com), featuring articles, videos, talks, workshops, and experiments by our talented developers and technology experts. Built with Next.js and modern web technologies, it serves as a hub for sharing knowledge and insights from the iO development community.

**🌐 Live Site:** [techhub.iodigital.com](https://techhub.iodigital.com)

## Features

- 📝 **Articles & Blog Posts** - MDX-powered content with rich markdown support
- 🎥 **Video Content** - Integration with YouTube for latest videos
- 🎤 **Talks & Workshops** - Conference presentations and educational content
- 🧪 **Experiments** - Interactive demos and proof-of-concepts
- 👥 **Author Profiles** - Detailed contributor pages with social links
- 🏷️ **Tagging System** - Organized content categorization
- 📱 **Responsive Design** - Mobile-first, accessible interface
- 🌙 **Dark Mode** - Theme switching support
- 🔍 **SEO Optimized** - Meta tags, Open Graph, and sitemap generation
- ⚡ **Performance** - Optimized builds with Next.js 15
- 🔒 **Type Safety** - Full TypeScript implementation with 60%+ type coverage

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) with React 19
- **Language:** [TypeScript](https://www.typescriptlang.org/) with strict type checking
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Content:** [MDX](https://mdxjs.com/) with gray-matter frontmatter
- **Testing:** [Vitest](https://vitest.dev/) + React Testing Library
- **Database:** [Supabase](https://supabase.com/)
- **Deployment:** [Vercel](https://vercel.com/)
- **Analytics:** Google Tag Manager

## Quick Start

### Prerequisites

- **Node.js:** Version 22.x or higher
- **npm:** Version 10.x or higher
- **yarn:** Version 1.x for package management
- **git-lfs:** Required for large file handling — [install instructions](https://git-lfs.com) (macOS: `brew install git-lfs`, Windows: included with Git for Windows, Linux: via package manager), then run `git lfs install`

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/iodigital-com/io-technology.git
   cd io-technology
   ```

2. **Install dependencies**

   ```bash
   yarn
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**

   ```bash
   npm start
   # or
   npm run dev
   ```

5. **Open your browser**

   Visit [http://localhost:3000](http://localhost:3000) to see the site running locally.

### Development Scripts

```bash
# Development with file watching
npm start              # Development server with file watching
npm run dev            # Standard Next.js development server

# Building & Production
npm run build          # Build for production + generate sitemap
npm run serve          # Start production server
npm run analyze        # Bundle analysis

# Code Quality
npm run lint           # ESLint with auto-fix
npm run type-check     # TypeScript type checking
npm test               # Run all tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Run tests with coverage report
npm run test:ui        # Run tests with UI interface


# Dependency Management
npm run update:patch   # Update patch versions
npm run update:minor   # Update minor versions
npm run update:major   # Update major versions
```

## TypeScript

This project uses TypeScript with strict type checking enabled. Type definitions are organized in the `/types` directory with centralized exports.

```bash
# Type checking
npm run type-check     # Check types without compilation
npx tsc --noEmit       # Direct TypeScript check
```

## Project Structure

```
io-technology/
├── components/          # React components
│   ├── Analytics/       # Google Analytics integration
│   ├── ContentCard/     # Article/content display cards
│   ├── Footer/          # Site footer
│   ├── Head/           # HTML head management
│   ├── HeroSection/    # Homepage hero
│   ├── ThemeSwitch/    # Dark/light mode toggle
│   └── ...
├── data/               # Content and configuration
│   ├── authors/        # Author profiles (.md)
│   ├── blog/          # Blog posts (.md/.mdx)
│   ├── series/        # Article series
│   ├── talks/         # Conference talks
│   ├── workshops/     # Workshop content
│   └── siteMetadata.js # Site configuration
├── layouts/           # Page layout components
├── lib/              # Utility functions and helpers
│   ├── authors/      # Author data processing
│   ├── events/       # Event management
│   ├── jobs/         # Job listings
│   ├── mdx/          # MDX processing
│   └── utils/        # General utilities
├── pages/            # Next.js pages
│   ├── api/          # API routes
│   ├── articles/     # Article pages
│   ├── authors/      # Author profile pages
│   └── ...
├── public/           # Static assets
├── tests/           # Test configuration and utilities
├── types/           # TypeScript type definitions
│   ├── api.ts       # API and response types
│   ├── content.ts   # Content and author types
│   ├── events.ts    # Event-related types
│   ├── forms.ts     # Form and validation types
│   ├── site.ts      # Site configuration types
│   └── index.ts     # Main type exports
└── tsconfig.json    # TypeScript configuration
```

## Content Management

### Adding a New Article

1. **Create your article file**

   ```bash
   # Create in data/blog/
   touch data/blog/your-article-title.md
   ```

2. **Add frontmatter**

   ```yaml
   ---
   title: 'Your Article Title'
   date: '2024-01-15'
   lastmod: '2024-01-15'
   tags: ['javascript', 'react', 'nextjs']
   draft: false
   summary: 'Brief description of your article'
   authors: ['your-author-slug']
   ---
   ```

3. **Write your content**

   ```markdown
   # Your Article Title

   Your content here...
   ```

### Creating Author Profiles

Author profiles are stored in `data/authors/` as `.md` files:

```yaml
---
name: 'Your Name'
avatar: '/authors/your-name.jpg'
occupation: 'Senior Developer'
company: 'iO'
email: 'your.email@iodigital.com'
twitter: 'https://twitter.com/yourhandle'
linkedin: 'https://linkedin.com/in/yourprofile'
github: 'https://github.com/yourusername'
---
Bio content in markdown...
```

### Content Types

- **Articles** (`data/blog/`) - Main blog content
- **Series** (`data/series/`) - Multi-part article series
- **Talks** (`data/talks/`) - Conference presentations
- **Workshops** (`data/workshops/`) - Educational workshops
- **Experiments** (`data/experiments/`) - Interactive demos

## Testing

This project includes comprehensive testing with extensive test coverage across multiple test files.

### Running Tests

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode for development
npm run test:coverage # Generate coverage report
npm run test:ui       # Interactive test UI
```

### Test Structure

- **Component Tests** - React component functionality
- **Utility Tests** - Helper function validation
- **Integration Tests** - Feature interactions
- **Accessibility Tests** - ARIA and keyboard navigation
- **Security Tests** - XSS prevention and input validation

## Contributing

We welcome contributions from the iO community! Here's how to get involved:

### Writing Articles

1. Read our [contribution guidelines](data/contribute/contribute.mdx)
2. Check the [Wiki](https://github.com/iodigital-com/io-technology/wiki) for detailed instructions
3. Fork the repository and create your content
4. Submit a pull request for review

### Development Contributions

1. **Fork and clone** the repository
2. **Create a feature branch** from `main`
3. **Make your changes** with appropriate tests
4. **Run the test suite** to ensure everything passes
5. **Submit a pull request** with a clear description

### Code Style

- **TypeScript** with strict type checking enabled
- **ESLint** and **Prettier** are configured for consistent formatting
- **Husky** pre-commit hooks ensure code quality and type safety
- Follow existing patterns and component structure
- Add tests for new features and utilities

## Deployment

The site is automatically deployed to Vercel when changes are pushed to the main branch.

### Build Process

```bash
npm run build
```

This will:

- Build the Next.js application
- Generate the sitemap
- Create dev.to syndication files
- Optimize images and assets

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Required for full functionality
YOUTUBE_API_KEY=your_youtube_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
MAILCHIMP_API_KEY=your_mailchimp_api_key
MAILCHIMP_API_SERVER=your_mailchimp_server
```

## Performance & SEO

- **Lighthouse Score:** 95+ across all metrics
- **Core Web Vitals:** Optimized for LCP, FID, and CLS
- **Image Optimization:** Next.js Image component with responsive sizing
- **Meta Tags:** Comprehensive Open Graph and Twitter Card support
- **Sitemap:** Auto-generated XML sitemap
- **RSS Feed:** Available at `/feed.xml`

## Support & Resources

- **Documentation:** [GitHub Wiki](https://github.com/iodigital-com/io-technology/wiki)
- **Issues:** [GitHub Issues](https://github.com/iodigital-com/io-technology/issues)
- **Dependencies:** See [UPDATING.md](./UPDATING.md) for update guidelines
- **Email:** [info@iodigital.com](mailto:info@iodigital.com)

## Contributors

Thank you to all our amazing [contributors](https://github.com/iodigital-com/io-technology/graphs/contributors) ❤️

<a href="https://github.com/iodigital-com/io-technology/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=iodigital-com/io-technology" />
</a>

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by the iO development team**
