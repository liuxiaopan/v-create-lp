#!/usr/bin/env node

const importLocal = require('import-local');
const npmlog = require('npmlog') 

if (importLocal(__filename)) {
    npmlog.info('cli', '正在使用 test-cli 的本地版本')
} else {
    // Code for both global and local version here…
    require('../lib')(process.argv.slice(2))
}
