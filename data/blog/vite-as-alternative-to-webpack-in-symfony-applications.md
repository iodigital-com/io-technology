---
title: 'Vite as an alternative to webpack-encore in Symfony applications'
date: '2022-06-24'
tags: ['frontend', 'vite', 'symfony']
images: ['/articles/vite-as-alternative-to-webpack-in-symfony-applications/hero.webp']
summary: 'Vite (French word for "quick", pronounced /vit/, like "veet") is the fastest frontend build tool at the moment. Webpack-encore integrates perfectly with symfony applications. What if we could have both'
authors: ['yves-maerschalck']
theme: 'blue'
---

Whenever you create a new Symfony application, there will be a moment you have to set up your frontend tooling to build your CSS and JavaScript. The easiest way to do this would be to just follow the instructions on the [Symfony docs](https://symfony.com/doc/current/frontend.html).
This will set up Webpack-encore for you, which is a great way to build frontend code inside your Symfony project.

But sometimes you may want something different. You've heard a lot of good things about Vite, you maybe went to a conference where everybody seemed to be using this tool. Or maybe you just want to join all the cool kids and use the hottest tool of the moment.

<div className="p-4 bg-io_blue-100 font-serif">All examples used in this blogpost will be using [Vue](https://vuejs.org/), but Vite can be used with a variety of frameworks.</div>

The following setup will only be usefull for developers who work in a hybrid symfony/javascript environment where you render your page in twig and you spawn your [SPA](https://en.wikipedia.org/wiki/Single-page_application) or Vue component on this page.

## Why would you want to replace Webpack with Vite?

**Webpack** is a bundler-based build tool, which means that to serve your application, it needs to crawl, process, and concatenate your application’s entire JavaScript file. This applies to the dependencies and the application code that you write. This is the reason why it takes the webpack dev-server quite a long time to start up. With large applications, starting times can take up to 10 minutes.

Whenever you save a file, the whole JavaScript bundle will be rebuilt by Webpack, which is why the change can take up to 10 seconds to be reflected in the browser, even with HMR enabled. The slow feedback loop caused by Webpack creates a bad developer experience for developers working on large-scale JavaScript applications.

**Vite** on the other hand leverages the availability of **ES Modules in the browser** and **compile-to-native bundler tools** like esbuild.

The use of ES Modules allows you to run a JavaScript application on the browser without having to bundle them together. Esbuild is a JavaScript bundler written in Go that performs 10–100x faster than Webpack.

While a bundler-based workflow like Webpack will have to process your entire JavaScript modules before a single browser request, Vite only processes your dependency modules before a single browser request.

## Scaffolding a Vue app with Vite

When creating a new app, you can do this the [vite-way](https://vitejs.dev/guide/#scaffolding-your-first-vite-project) or the [vue-way](https://vuejs.org/guide/quick-start.html#with-build-tools). Or with the following commands:

With Vite:

```shell
npm create vite@latest
```

With Vue:

```shell
npm init vue@latest
```

If you are building a Vue app, I recommend the latter. This way allows you to add dependencies like Typescript support, Pinia, Vitest, ... out of the box. After creating the app and installing the dependencies, you can execute `npm run dev` and your app will be available for coding and thanks to Hot Module Replacement every change will be pushed to the browser instantly.

And this is where Vite really shines.
You can read more about the [speed of Vite](https://vitejs.dev/guide/why.html#slow-server-start) on the documentation website.

## A little about webpack-encore

When using webpack-encore, we have several helper functions available to include our build javascript and css files in our twig files

```twig
{{ encore_entry_link_tags('app') }}
```

which will create the following html-tag:

```html
<link rel="stylesheet" href="{{ asset('build/app.123680sd32.css') }}" />
```

and

```twig
{{ encore_entry_link_tags('app') }}
```

which creates

```html
<script src="{{ asset('build/app.123680sd32.js') }}"></script>
```

Under the hood, encore will use a manifest file to map entry points with the correct source file. Thanks to this way of working, we don't have to worry about old cached files with the same name.

## How about Vite?

If you created your app with Vite, there will be an `index.html` file where you can find the following script tag:

```html
<script type="module" src="/src/main.js"></script>
```

Now, this works great when using the Vite dev-server, but if you just copy/paste this code into your twig-file, you'll only get a 404 - file not found - error. So the first thing we'll have to create will be a twig extension that we can use like we did with webpack encore:

For JavaScript:

```twig
{{ vite_asset_js('main') }}
```

And likewise for CSS:

```twig
{{ vite_asset_css('main') }}
```

## Creating the Twig extension

In the Twig extension folder (normally `src/Twig/Extension`), we'll create a new class

<div className="p-4 bg-io_blue-100 text-io_blue-800">This example uses <b>.ts</b> files. Just change this to <b>.js</b> if you don't use Typescript</div>

```php
<?php

namespace MyApp\Twig\Extension;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class ViteAssetExtension extends AbstractExtension
{
    private bool $isDev;
    private string $manifest;

    public  function __construct(string $env, string $manifest)
    {
        $this->isDev = $env === 'DEV';
        $this->manifest = $manifest;
    }

    public function getFunctions()
    {
        return [
            new TwigFunction(
                'vite_asset_js',
                [$this, 'getAssetJs'],
                ['is_safe' => ['html']]
            ),
            new TwigFunction(
                'vite_asset_css',
                [$this, 'getAssetCss'],
                ['is_safe' => ['html']]
            ),
        ];
    }

    public function getAssetJs(string $entry)
    {
        if ($this->isDev) {
            return $this->getAssetDevJs($entry);
        }

        return $this->getAssetProdJs($entry);
    }

    public function getAssetCss(string $entry)
    {
        if(!$this->isDev) {
            return $this->getAssetProdCss($entry);
        }
        return '';
    }

    public function getAssetProdJs(string $entry)
    {
        $data = json_decode(file_get_contents($this->manifest), true);
        $file = $data['src/'.$entry.".ts"]['file'];

        $html = <<<HTML
<script type="module" src="/frontend/{$file}"></script>
HTML;

        return $html;
    }

    public function getAssetProdCss(string $entry)
    {
        $data = json_decode(file_get_contents($this->manifest), true);

        if (!array_key_exists('css', $data['src/'.$entry.".ts"])) {
            return '';
        }

        $css = $data['src/'.$entry.".ts"]['css'];

        $html = '';

        foreach ($css as $cssFile) {
            $html .= <<<HTML
<link rel="stylesheet" media="screen" href="/frontend/{$cssFile}" />
HTML;
        }

        return $html;
    }

    public function getAssetDevJs(string $entry)
    {
        return <<<HTML
<script type="module" src="http://localhost:3000/@vite/client"></script>
<script type="module" src="http://localhost:3000/src/{$entry}.ts"></script>
HTML;

    }


}
```

### Dev mode

When you have your Vite dev-server running, we will only inject the javascript entry because this will also import the necessary styles. We will have to load both the Vite client and the entrypoint file:

```html
<script type="module" src="http://localhost:3000/@vite/client"></script>
<script type="module" src="http://localhost:3000/src/{$entry}.ts"></script>
```

If you want to make this extension even better, you could opt to put the dev-server URL in an environment variable, but for now, you get the idea. You can now use the helper function

```twig
{{ vite_asset_js('main') }}
```

in your twig file and the javascript app with the entrypoint `main.js` will be loaded and executed inside your twig source code. Don't forget to also add the div with the correct id inside this file:

```html
<div id="app"></div>
```

You now have a working Vue app inside your Symfony rendered page where you can use all the advantages of the fast Vite tooling.

### Prod mode

If we want to deploy our app to production, we will first have to build it. Normally when building a Vite app, the build process will create a `dist` folder inside the app folder. We'll have to edit our `vite.config.ts` (or .js) to alter this behaviour.

```javascript
import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), svgLoader()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    manifest: true,
    assetsDir: '',
    outDir: '../../web/frontend',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: './src/main.ts',
      },
    },
  },
})
```

Make sure the `outDir` is the same as the one you used in the Twig extension. In this example we've opted to empty the output dir on each build, but this is not necessary.

## One build, multiple apps

In a hybrid environment like this, it's likely that you're not building one large Vue app, but probably multiple smaller ones to use as components on a twig-rendered page. In theory, you could scaffold each and every one of these apps in its own folder, but this is not really maintainable.
You could also decide not to build your apps as standalone apps, but more as web components or something, but that's not the scope of this article.

Normally when you create your Vite project, you'll get a file structure as following:

```
- src
    - main.ts
- public
- index.html
- package.json
- vite.config.ts
...
```

To build multiple apps, you just have to create a folder for each app and put an `index.html` inside it

```
- app1
    - index.html
- app2
    - index.html
- src
    - main.ts
    - app1.ts
    - app2.ts
- public
- index.html
- package.json
- vite.config.ts
...
```

Then, in your `vite.config.ts`, you can add them to your input files:

```javascript
{
    rollupOptions: {
      input: {
        'main': './src/main.ts',
        'app1': './src/app1.ts',
        'app2': './src/app2.ts'
      }
    }
}
```

## Best of both worlds

If you are working on a project with a team of frontend- and backend developers, this way of working might be very interesting. The frontenders will be able to develop Vue apps outside of Symfony.
Because your are still running your dev-server during development, it'll still be possible to just surf to `https://localhost:3000` and just develop your frontend like you normally do. When using multiple apps, just navigate to `https://localhost:3000/app1/` (don't forget the trailing slash) and you're set.

Let me know what works for you. All tips and tricks are welcome!
