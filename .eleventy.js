const fs = require("fs");
const path = require("path");
const postcss = require("postcss");
const xml2js = require('xml2js');

const outputDir = 'website/_site';

module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy({'website/public': '/'})

    makeComparisons(eleventyConfig);

    eleventyConfig.addFilter('fromBase64', atob);

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

    eleventyConfig.addPassthroughCopy({'node_modules/prismjs/prism.js': 'js/prism.js'});
    eleventyConfig.addPassthroughCopy(
        {'node_modules/prismjs/components/prism-markup-templating.min.js': 'js/prism-markup-templating.min.js'}
    );
    eleventyConfig.addPassthroughCopy({'node_modules/prismjs/components/prism-php.min.js': 'js/prism-php.min.js'});
    eleventyConfig.addPassthroughCopy(
        {'node_modules/prism-themes/themes/prism-darcula.min.css': 'css/prism-darcula.min.css'}
    );
    eleventyConfig.addPassthroughCopy(
        {'node_modules/prismjs/plugins/line-numbers/prism-line-numbers.min.css': 'css/prism-line-numbers.min.css'}
    );
    eleventyConfig.addPassthroughCopy(
        {'node_modules/prismjs/plugins/line-numbers/prism-line-numbers.min.js': 'js/prism-line-numbers.min.js'}
    );

    return {
        dir: {
            input: 'website/src',
            output: outputDir,
            layouts: '_layouts',
        }
    }
};

function makeComparisons(eleventyConfig) {
    if(! analysesAreAvailable([
        'phan-strict',
        'phan-loose',
        'phpstan-strict',
        'phpstan-loose',
        'psalm-strict',
        'psalm-loose',
    ])) {
        throw new Error('Build cancelled due to missing requirements');
    }

    const phanStrict = reformatCheckstyle('phan-strict');
    const phanLoose = reformatCheckstyle('phan-loose');
    const phpstanStrict = reformatCheckstyle('phpstan-strict');
    const phpstanLoose = reformatCheckstyle('phpstan-loose');
    const psalmStrict = reformatCheckstyle('psalm-strict');
    const psalmLoose = reformatCheckstyle('psalm-loose');

    eleventyConfig.addPassthroughCopy({'comparison.schema.json': '/'});

    let comparisons = [];
    const sampleRegex = /^\d+\.php$/;
    const samples = fs.readdirSync('samples');
    for (let i in samples) {
        if (! sampleRegex.test(samples[i])) {
            continue;
        }

        let name = 'samples/' + samples[i];

        let instance = {
            $schema: 'https://cjw6k.github.io/php-static-analyzer-comparison/comparison.schema.json',
            document: fs.readFileSync('samples/' + samples[i]).toString('base64'),
            analyses: [
                {
                    analyzer: 'phan-strict',
                    errors: phanStrict[name] ?? []
                },
                {
                    analyzer: 'phan-loose',
                    errors: phanLoose[name] ?? []
                },
                {
                    analyzer: 'phpstan-strict',
                    errors: phpstanStrict[name] ?? []
                },
                {
                    analyzer: 'phpstan-loose',
                    errors: phpstanLoose[name] ?? []
                },
                {
                    analyzer: 'psalm-strict',
                    errors: psalmStrict[name] ?? []
                },
                {
                    analyzer: 'psalm-loose',
                    errors: psalmLoose[name] ?? []
                },
            ]
        };

        fs.writeFileSync(
            'build/comparisons/' + path.parse(samples[i]).name + '.json',
            JSON.stringify(instance)
        );
        comparisons.push({"id": path.parse(samples[i]).name, "instance": instance});
    }

    eleventyConfig.addPassthroughCopy({'build/comparisons/*.json': '/comparisons'});
    eleventyConfig.addGlobalData('comparisons', comparisons);
}

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

function reformatCheckstyle(analyzer) {
    let set = {};
    xml2js.parseString(
        fs.readFileSync('build/analyzer-outputs/' + analyzer + '.xml'),
        {},
        (err, result) => {
            for (let i in result.checkstyle.file) {
                let fileChecks = result.checkstyle.file[i];
                let fileName = fileChecks.$.name;

                // for psalm
                if (fileName.indexOf('samples/') !== 0) {
                    fileName = 'samples/' + fileName;
                }

                if (typeof set[fileName] === 'undefined') {
                    set[fileName] = [];
                }

                for (let j in fileChecks.error) {
                    let reportedError = fileChecks.error[j].$;

                    // for psalm and phpstan
                    if (typeof reportedError.source === 'undefined') {
                        reportedError.source = 'n/a';
                    }

                    set[fileName].push(reportedError);
                }
            }
        }
    );

    return set;
}
