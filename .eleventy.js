const fs = require("fs");
const path = require("path");
const postcss = require("postcss")
const outputDir = 'website/_site';

module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy({'website/public': '/'})
    eleventyConfig.addPassthroughCopy({'_out/*.xml': '/'})

    const cssnano = postcss([require('cssnano')({preset: require('cssnano-preset-default')})]);
    const minifyCss = (src, dest) => {
        cssnano.process(fs.readFileSync(src), {from: src, to: dest}).then(result => {
            let baseDir = path.dirname(outputDir + '/' + dest);
            if (! fs.existsSync(baseDir)) {
                fs.mkdirSync(baseDir, {recursive: true});
            }
            fs.writeFileSync(outputDir + '/' +dest, result.css)
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
