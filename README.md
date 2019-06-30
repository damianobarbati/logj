# logj

This package overloads built-in node console logging everything as JSON to `console` or into file.
This makes easier to search into logs files in a structured way using `jq`.

## Usage:

Usage is ENV driven:

### Disabled mode
If env `LOG_FILE` is empty then `console` methods are not overloaded.
```
LOG_FILE='' node -r 'logj' index.js
```
- `console.log` and `console.error` default behaviour is preserved.
- no file is written

### Console mode
If env `LOG_FILE=console` then `console` methods print JSON to stdout and stderr (docker container typical usage).
```
LOG_FILE=console LOG_PRETTY=1 node -r 'logj' index.js
```
- `console.log` and `console.error` default behaviour is changed: statements are print as JSON
- no file is written

### File mode
If env `LOG_FILE=<filename>` then `console` methods both print to stdout and stderr AND into given file.
```
LOG_FILE=./std.log LOG_PRETTY=1 node -r 'logj' index.js
```
- `console.log` and `console.error` methods default behaviour is preserved
- file is written with `console.log` and `console.error` statements as JSON lines

#### JSON statements

JSON statements are logged with the following additional properties:
- `std`: either `output` or `error`
- `timestamp`: ISO string (`new Date().toISOString()`)
- `error`: this is an handy shortcut providing `error.message` when logging a thrown exception with `console.error`

A global `console.jsonReplacer` may be defined to provide a custom json replacer to the logger: it is invoked for every JSON line generated.