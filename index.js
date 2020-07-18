const { createWriteStream } = require('fs');

const { LOGJ, LOGJ_MORE = false, LOGJ_PRETTY, npm_package_name: name, npm_package_version: version } = process.env;

if (LOGJ) {
    const stream = (LOGJ !== 'console') ? createWriteStream(LOGJ, { flags: 'a' }) : null;
    const { log, error } = console;

    console.log = function () {
        const logLine = getLogLine('output', arguments) + '\n'; // get log line

        if (LOGJ === 'console')
            process.stdout.write(logLine);
        else {
            log.apply(this, arguments); // call original console function
            stream.write(logLine, error => error && process.stderr.write(error)); // append into log file
        }
    };

    console.logWith = custom => function () {
        const logLine = getLogLine('output', arguments, custom) + '\n'; // get log line

        if (LOGJ === 'console')
            process.stdout.write(logLine);
        else {
            log.apply(this, arguments); // call original console function
            stream.write(logLine, error => error && process.stderr.write(error)); // append into log file
        }
    };

    console.error = function () {
        const logLine = getLogLine('error', arguments) + '\n'; // get log line

        if (LOGJ === 'console')
            process.stderr.write(logLine);
        else {
            error.apply(this, arguments); // call original console function
            stream.write(logLine, error => error && process.stderr.write(error)); // append into log file
        }
    };

    console.errorWith = custom => function () {
        const logLine = getLogLine('error', arguments, custom) + '\n'; // get log line

        if (LOGJ === 'console')
            error.apply(this, arguments); // call original console function
        else {
            process.stderr.write(logLine);
            stream.write(logLine, error => error && process.stderr.write(error)); // append into log file
        }
    };
}

const getLogLine = (std, args, custom = {}) => {
    const out = args.length === 1 ? args[0] : args;

    const logLine = LOGJ_MORE ? {
        std,
        time: new Date().toISOString(),
        timestamp: new Date().getTime(),
        name,
        version,
        ...custom,
        out,
    } : custom ? {
        ...custom,
        out,
    } : out;

    try {
        const logLineJSON = JSON.stringify(logLine, console.jsonReplacer, LOGJ_PRETTY);
        return logLineJSON;
    }
    catch (error) {
        Object.assign(logLine, { error: error.message });
        const logLineJSON = JSON.stringify(logLine, console.jsonReplacer, LOGJ_PRETTY);
        return logLineJSON;
    }
};

