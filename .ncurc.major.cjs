const minorConfig = require('./.ncurc.minor.cjs');

module.exports = {
    ...minorConfig,
    reject: [
        ...minorConfig.reject,
        'react', // @lottiefiles/react-lottie-player is incompatible with react 19
        'react-dom', // https://github.com/LottieFiles/lottie-react/issues/168
    ],
    target: 'latest',
};
