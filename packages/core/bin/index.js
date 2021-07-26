#!/usr/bin/env node

const importLocal = require('import-local');
const npmlog = require('npmlog') 

console.log('123')
if (importLocal(__filename)) {
    console.log('Using local version of this package');
    npmlog.info('cli', '正在使用 test-cli 的本地版本')
} else {
    // Code for both global and local version here…
    require('../lib')(process.argv.slice(2))
}
