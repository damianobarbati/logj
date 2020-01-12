const { version } = require('./package.json');
const { createWriteStream } = require('fs');

const { LOGJ, LOGJ_PRETTY } = process.env;

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
    const logLine = {
        std,
        timestamp: new Date().toISOString(),
        version,
        ...custom,
        ...args,
    };

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