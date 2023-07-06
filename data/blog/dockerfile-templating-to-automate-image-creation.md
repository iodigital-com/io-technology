---
title: 'Dockerfile templating to automate image creation'
date: '2022-08-23'
tags: ['infrastructure']
images:
  [
    '/articles/dockerfile-templating-to-automate-image-creation/dockerfile-templating-steps-transparent.png',
  ]
summary: "If we take a look at the repository for the official Node.js Docker images we can see that the source contains a Dockerfile for each image variant. Imagine having to add a package to all of these images. That's a lot of manual edits, but it's manageable. Now imagine adding a package to only specific versions of the image and a different package depending on the Linux distro."
authors: ['luud-janssen']
theme: 'blue'
canonicalUrl: 'https://www.iodigital.com/en/history/isaac/dockerfile-templating-to-automate-image-creation'
---

A lot of open source projects distribute multiple versions of their Docker images on Docker Hub. For example, Node.js has [a set of officially supported images](https://hub.docker.com/_/node/) for each Node.js use case. For starters, they have a Docker image for each patch version of the runtime, but even those are [split up into multiple images based on different distributions of Linux](https://github.com/nodejs/docker-node#image-variants). I take Node.js as an example here, but this is a very common pattern across official Docker images.

If we take a look at the repository for the official Node.js Docker images we can see that the source contains a Dockerfile for each image variant. And that's a problem because maintenance on these images gets complicated quickly. Imagine having to add a package to all of these images. That's a lot of manual edits, but it's manageable. Now imagine adding a package to only specific versions of the image and a different package depending on the Linux distro. It's doable, but it's not fault-tolerant and you can quickly lose track of all the different rules.

This might not be a problem for the [Node.js Docker images team](https://github.com/nodejs/docker-node/graphs/contributors). But at iO, we have built images for our Magento projects that do suffer from these problems. These build images are used by our continuous integration system and have all the dependencies necessary to create a production-ready Magento instance, which includes building the front-end, installing Composer dependencies and more. This requires the images to contain PHP, Node.js and a lot of additional Linux packages. We also need these images to be available for different Node.js and PHP versions, and the "additional Linux packages" differ based on these versions. You can see why simply having a lot of Dockerfiles would result in quickly getting lost in the complexity of all of these rules and would be difficult to maintain.

That's why we decided to take a different approach and create Dockerfile templates that would be populated with each language's and framework's version, which results in a set of buildable Dockerfiles. We also automated this process with the use of Jenkins, which would recompile these templates on a daily basis, build the resulting Dockerfiles and upload them to our Docker image registry. We build these daily to ensure we always have an image ready with the latest versions. In case a vulnerability is found in a specific Node.js or PHP version, our teams can quickly update the image to the latest version.

All of this produces a clean, maintainable project resulting in Docker images which automatically update for use in our various e-commerce teams. In this article, I'll explain our approach and show you how you can set up such a project.

## Assumed knowledge

This article requires you to have basic knowledge of:

- Docker containers and their use cases
- Continuous integration tooling (such as Jenkins)
- Node.js

## The concept

The generation process consists of three steps:

1. Compiling Dockerfile templates using values defined in a config file
2. Generating an output file that lists all generated Dockerfiles
3. Building and publishing all the generated Dockerfiles using Jenkins

![Dockerfile templating steps](/articles/dockerfile-templating-to-automate-image-creation/dockerfile-templating-steps-transparent.png)

I'll first talk about compiling the dockerfiles and generating the output file in Node.js and then we'll make a switch to building the images with Jenkins.

## Compiling Dockerfiles

This concept translates to any templating language, but we chose [Nunjucks](https://github.com/mozilla/nunjucks) as our templating library because it has a rich syntax which can handle most use cases. We'll start by setting up a new Node.js project with the required dependencies:

```bash
    mkdir docker-templates
    cd docker-templates
    npm init
    npm install nunjucks fs-extra rimraf
```

We're installing `fs-extra` and `rimraf` to write and clean the output files and make our lives slightly easier.

Note: In this tutorial, we're going to use the new Node.js [ECMAScript module syntax](https://nodejs.org/api/esm.html). Be sure to use a Node.js version that supports this if you follow along. Also, don't forget to add the `"type": "module"` declaration to your `package.json` file.

Let's start by creating the Dockerfile template:

```dockerfile
    FROM php:{{ php }}-cli

    {# Install base dependencies -#}
    RUN apt-get update \

    {#- Skip recommended installs to reduce image size #}
        && apt-get install -y --no-install-recommends \
            git \
            ssh \

    {#- Install packages specific to a PHP version #}
    {%- if php === "7.3" %}
            libbz2-dev \
    {%- endif %}

    {#- Add a line that'll always be executed to end correctly after adding the escape (\) character on each line #}
        && echo "Finished installing packages"

    {# Get Composer #}
    COPY --from=composer:1 /usr/bin/composer /usr/bin/composer

    {#- Install Node.js #}
    RUN curl -sL https://deb.nodesource.com/setup_{{ node }}.x | bash - \
        && apt-get install -y --no-install-recommends nodejs \

    {#- Clean APT cache #}
        && rm -rf /var/lib/apt/lists/* \
        && apt-get clean
```

This is just a dummy template, but it's an example to show that we can create multiple variants of the same Dockerfile using a basic template syntax.

Now, let's add a configuration file that dictates which versions of this template to compile:

```json
{
  "php": ["7.3", "7.4"],
  "node": ["10", "12", "14"]
}
```

We want to create a script that takes the different combinations of PHP versions and Node.js versions and outputs the different Dockerfiles, so let's first generate a function that can output the combinations of these versions:

```javascript
import fse from 'fs-extra'

/**
 * Returns all PHP and Node.js versions in the given config file
 */
async function getVersions(file) {
  const config = await fse.readJson(file)
  const versions = []

  for (const phpVersion of config.php) {
    for (const nodeVersion of config.node) {
      versions.push({
        php: phpVersion,
        node: nodeVersion,
      })
    }
  }

  return versions
}
```

Next, we want to create functions that can turn a Nunjucks template into a file specific for the version combinations of PHP and Node.js:

```javascript
import { promises as fs } from 'fs'
import nunjucks from 'nunjucks'
import { dirname } from 'path'

/**
 * Compiles a Nunjucks template given a filename
 *
 * @param file The filename of the template to compile
 * @return A Nunjucks template which can be rendered later
 */
async function compileTemplate(file) {
  const templateContents = await fs.readFile(file, 'utf-8')
  return nunjucks.compile(templateContents)
}

/**
 * Promisified version of the `nunjucks.render` method to render a precompiled template
 * given a certain context.
 *
 * @param template The prepared template from the prepare method
 * @param context The context with which to render the template
 */
async function render(template, context) {
  return new Promise((resolve, reject) => {
    nunjucks.render(template, context, function (error, result) {
      if (error) {
        reject(error)
      }

      resolve(result)
    })
  })
}

/**
 * Writes a Dockerfile given a template and template context.
 *
 * @param template A compiled Nunjucks template
 * @param file The file path to write to
 * @param versions The version combination as context for the template, e.g. { php: "7.2", node: "10" }
 * @return An object containing all the versions as well as the file that was created
 */
async function createDockerfile(template, file, versions) {
  const dockerfile = await render(template, versions)
  const directory = dirname(file)
  await fs.mkdir(directory, { recursive: true })
  await fs.writeFile(file, dockerfile, 'utf-8')

  return {
    ...versions,
    file,
  }
}

/**
 * Creates Dockerfiles using a template and a set of version combinations
 *
 * @param template A compiled Nunjucks template
 * @param versions The version combination as context for the template, e.g. { php: "7.2", node: "10" }
 */
async function createDockerfiles(template, versions) {
  return Promise.all(
    versions.map((version) =>
      createDockerfile(
        template,
        `${outputDirectory}/php-${version.php}/node-${version.node}.Dockerfile`,
        version
      )
    )
  )
}
```

The `compileTemplate` and `render` function are used to turn the Nunjucks templates into files and the `createDockerfile` and `createDockerfiles` functions take a (set of) combination(s) of versions and render them using the previous methods.

Next, we'll put it all together in a `bootstrap` method:

```javascript
import { default as rimrafCallback } from 'rimraf'
import { promisify } from 'util'
import { promises as fs } from 'fs'

const configFile = 'config.json'
const templateFile = 'templates/base.Dockerfile.njk'
const outputDirectory = 'output'

const rimraf = promisify(rimrafCallback)

async function bootstrap() {
  // Delete the output folder before building
  await rimraf(outputDirectory)

  // Get the version combinations
  const versions = await getVersions(configFile)

  // Compile the Dockerfile template
  const template = await compileTemplate(templateFile)

  // Create the ouptut directory
  await fs.mkdir(outputDirectory)

  // Create the Dockerfiles and get the corresponding information
  const files = await createDockerfiles(template, versions)

  // Write the infromation to an output.json file
  await fs.writeFile(`${outputDirectory}/output.json`, JSON.stringify(files, null, 2))
}

bootstrap().then(() => console.log('Dockerfiles generated'))
```

This gives you a nice overview of all the steps in this process:

1. Clean up any previous builds
2. Get all versions to compile
3. Compile the template
4. Write compiled Dockerfiles to an output directory
5. Write an `output.json` file which contains all the created Dockerfiles so we can build them later

## Building the Dockerfiles

We created the Dockerfiles, but we still need to build them. We do this using Jenkins and [its Docker pipeline tools](https://www.jenkins.io/doc/book/pipeline/docker/).

Hint: If you have a Continuous Integration pipeline that allows directly executing the "docker" command, you could build the Dockerfiles directly in the Node.js application by spawning child processes.

Let's create a basic Jenkinsfile first:

```yaml
pipeline {
agent any

options {
// We perform our own checkout steps
skipDefaultCheckout(true)

// Prevent builds from running concurrently
disableConcurrentBuilds()

// Support ANSI colors
ansiColor('xterm')
}

triggers {
// We want to rebuild the images at midnight
cron('@midnight')
}

stages {
stage('Checkout') {
steps {
script {
deleteDir()
checkout(scm)
}
}
}
}
}
```

We'll create a function that takes an entry in the `output.json` file as input and builds the Dockerfile using Docker.

Note that we tag the images with "latest" and the current datetime which allows our developers to pin the image version to a specific date and only update when they intend to. The use of the "latest" tag can be unstable since the daily rebuild of the images will always install the latest (patch) version of all the frameworks, languages and packages involved.

```yaml
// Define the build function that returns a Docker build task
def build(def version) {
def now = new Date()
def datetime = now.format("yyyy-MM-dd'T'HH-mm-ss")

// Tag with the date and "latest"
def tags = [
datetime,
"latest"
]

// Pull the latest version of the image before building to ensure we're using Docker layer caching
def image = docker.build(version.image, "--pull -f ./${ version.file } .")

// Push all tags
tags.each { tag ->
image.push(tag)
}
}
```

What's left is to add a stage that runs the Node.js script in a Node.js container and another step that reads the output file and executes the build functions:

```yaml
    stage('Create Dockerfiles') {
        steps {
            script {
                // Run the NPM script in a Node.js Docker container
                docker
                    .image("node:14")
                    .inside() {
                        sh('npm ci')
                        sh('npm start')
                }
            }
        }
    }

    stage('Build') {
        steps {
            script {
                // For more info about registry set-up in Jenkins: https://www.jenkins.io/doc/book/pipeline/docker/#custom-registry
                docker.withRegistry("", "") {

                    // Read the needed image versions from the generated output.json file
                    def versions = readJSON(file: 'output/output.json')

                    versions.each { version ->
                        build(version)
                    }
                }
            }
        }
    }
```

And that's it! If we create a new pipeline in Jenkins that references this Jenkinsfile, Jenkins will run the Node.js script every night, create the Dockerfiles and push them to our registry.
