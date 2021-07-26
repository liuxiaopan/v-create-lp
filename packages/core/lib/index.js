'use strict';

const semver = require('semver')
const rootCheck = require('root-check')
const userHome = require('user-home')
const pathExists = require('path-exists').sync
const colors = require('colors')
const minimist = require('minimist')
const dotenv = require('dotenv')


const pkg = require('../package.json')
const log = require('@v-create-lp/log')
const { LOWEST_NODE_VERSION } = require('./contant')

module.exports = core;

function core() {
    // TODO
    try{
        getVersion()
        checkNodeVersion()
        checkRoot()
        checkUserHome()
        checkDebugArgs()
        checkEnv();
    } catch (e) {
        log.error(e.message)
    }

}

function getVersion() {
    console.log('pkg', pkg.version)
    log.success('version', pkg.version)
}

function checkNodeVersion() {
    const lowest = LOWEST_NODE_VERSION;
    const current = process.version;

    if(!semver.gte(current, lowest)) {
        throw new Error(`v-create-lp 需要安装v${lowest}以上版本的Node.js`)
    }
}

function checkRoot() {
    // 因为用超级用户创建的目录在用其他用户访问时会使权限校验不能通过，所以需要进行降级
    rootCheck();
}

function checkUserHome() {
    // 在后面,会在用户主目录下添加脚手架中的项目模版。
    log.info(userHome)
    if(!userHome || !pathExists(userHome)) {
        throw new Error(colors.red('当前登录用户目录不存在！'))
    }
}

function checkDebugArgs() {

    const args = minimist(process.argv.slice(2))
    if (args.debug) {
        log.changeLevel('verbose')
    }
    log.verbose('args-----', args.debug)
}


function checkEnv() {
    const config = dotenv.config()
    log.info('环境变量', config)

}