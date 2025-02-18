const patchConfig = require('./.ncurc.patch.cjs');

module.exports = {
    ...patchConfig,
    target: 'minor',
};
