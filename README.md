# logj

## Overview
This package overloads built-in node `console.log` and `console.error` methods to log everything as JSON.  
This makes easier to search into logs files in a structured way using `jq` when using a docker container and log aggregators (i.e: cloudwatch, kibana, etc).  

## Usage:

Start node with `logj` as entrypoint:
```bash
node -r logj index.js
```

Every `console.log` and `console.error` statement is print as JSON.  

Behaviour:
```javascript
console.log('hello');
// "hello"

console.log({ hello: 'world' });
// {"hello":"world"}

console.log({ hello: 'world' }, 'another argument');
// [0:{"hello":"world"},1:"another argument"]
```

Behaviour with `LOGJ=m`:
```javascript
console.log('hello');
// {"std":"output","time":"2020-07-19T16:17:12Z","name":"hello-world","version":"1.0.4","out":"hello"}

console.log({ hello: 'world' });
// {"std":"output","time":"2020-07-19T16:17:12Z","name":"hello-world","version":"1.0.4","out":{"hello":"world"}}

console.error(new Error('ops'));
// {"std":"error","time":"2020-07-19T16:17:12Z","name":"hello-world","version":"1.0.4","out":{"stack":"Error: ops\n    at Object.<anonymous> (/Users/damians/Desktop/logj/test/test.js:9:15)\n    at Module._compile (internal/modules/cjs/loader.js:1201:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1221:10)\n    at Module.load (internal/modules/cjs/loader.js:1050:32)\n    at Function.Module._load (internal/modules/cjs/loader.js:938:14)\n    at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:71:12)\n    at internal/main/run_main_module.js:17:47","message":"ops"}}
```

## Options

Behaviour can be changed passing a `LOGJ` environment variable: 
- `LOGJ=p`: pretty-print JSON
- `LOGJ=m`: add the following additional properties to log lines: 
    * `std`: either `output` or `error`
    * `time`: ISO8601 date
    * `name`: package name
    * `version`: package version
    * aforementioned properties are not added to log statement if there's an overlap between them and log properties   
- `LOGJ=pm` to enable both

A global `console.logjReplacer` may be defined to provide a custom json replacer applied for every JSON line generated.
