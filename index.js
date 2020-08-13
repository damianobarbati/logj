const { LOGJ = '' } = process.env;

const META = LOGJ.includes('m');
const PRETTY = LOGJ.includes('p');

console.log = function () {
    const logLine = getLog('output', arguments) + '\n';
    process.stdout.write(logLine);
};

console.info = console.log;

console.error = function () {
    const logLine = getLog('error', arguments) + '\n';
    process.stderr.write(logLine);
};

console.warn = console.error;

const errorToObject = error => JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)));

const arrayIntersection = (array1, array2) => array1.filter(value => array2.includes(value));

const getLog = (std, args) => {
    // errors do not have a default toString method thus we must serialize them
    args = Array.from(args).map(arg => arg instanceof Error ? errorToObject(arg) : arg);

    const out = args.length === 1 ? args[0] : args;

    const meta = {
        std,
        time: new Date().toISOString().slice(0, -5) + 'Z',
        name: process.env.npm_package_name,
        version: process.env.npm_package_version,
    };

    const metaOverlap = arrayIntersection(Object.keys(meta), Object.keys(out)).length > 0;
    const log = META && !metaOverlap ? { ...meta, out } : out;

    const result = JSON.stringify(log, console.logjReplacer, PRETTY ? 4 : null);
    return result;
};

