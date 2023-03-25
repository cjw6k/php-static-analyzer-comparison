const fs = require("fs");
const path = require("path");
const postcss = require("postcss")
const outputDir = 'website/_site';

module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy({'website/public': '/'})

    if(! analysesAreAvailable(['phan', 'phpstan', 'psalm'])) {
        throw new Error('Build cancelled due to missing requirements');
    }
    eleventyConfig.addPassthroughCopy({'build/analyzer-outputs/*.xml': '/'})

    const cssnano = postcss([require('cssnano')({preset: require('cssnano-preset-default')})]);
    const minifyCss = (src, dest) => {
        cssnano.process(fs.readFileSync(src), {from: src, to: dest}).then(result => {
            let baseDir = path.dirname(outputDir + '/' + dest);
            if (! fs.existsSync(baseDir)) {
                fs.mkdirSync(baseDir, {recursive: true});
            }
            fs.writeFileSync(outputDir + '/' + dest, result.css)
        });
    };

    minifyCss(
        'node_modules/sakura.css/css/sakura-dark-solarized.css',
        'css/sakura-dark-solarized.min.css'
    );

    return {
        dir: {
            input: 'website/src',
            output: outputDir,
            layouts: '_layouts',
        }
    }
};

function analysesAreAvailable(analyzers) {
    let foundAll = true;
    for (let i in analyzers) {
        if (! fs.existsSync('build/analyzer-outputs/' + analyzers[i] + '.xml')) {
            console.error('build/analyzer-outputs/' + analyzers[i] + '.xml is required for the build, but does not exist');
            foundAll = false;
        }
    }

    return foundAll;
}
