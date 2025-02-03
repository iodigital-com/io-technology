const minorConfig = require('./.ncurc.minor.cjs');

module.exports = {
    ...minorConfig,
    reject: [
        'mdx-bundler',
        'rehype-*',
        'remark-*',
    ],
    target: 'latest',
};
