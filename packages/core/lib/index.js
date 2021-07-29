'use strict';

const semver = require('semver')
const rootCheck = require('root-check')
const userHome = require('user-home')
const pathExists = require('path-exists').sync
const colors = require('colors')
const minimist = require('minimist')
const dotenv = require('dotenv')
const commander = require('commander')



const pkg = require('../package.json')
const log = require('@v-create-lp/log')
const init = require('@v-create-lp/init')
const { LOWEST_NODE_VERSION } = require('./contant')
const { getUpdatableVersions } = require('@v-create-lp/get-npm-info')
const program = new commander.Command()


module.exports = core;

async function core() {
    // TODO
    try{
        getVersion()
        checkNodeVersion()
        checkRoot()
        checkUserHome()
        // checkDebugArgs()
        checkEnv()
        await checkGlobalUpdate()
        registerCommand()
    } catch (e) {
        log.error(e.message)
    }

}

function getVersion() {
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
}


function checkEnv() {
    const config = dotenv.config()
    log.info('环境变量', config)

}


async function checkGlobalUpdate() {
    const {name, version} = pkg

    const updatableVersions = await getUpdatableVersions(name, version)
    if (updatableVersions && updatableVersions.length) {
        log.warn('模块可更新', `当前版本号是${colors.yellow(version)}, 可更新至最新版本${colors.green(updatableVersions[0])}`)
    } else{
        log.success('已是最新版本')
    }

}



function registerCommand() {
    const options = program.opts();
    program
        .name(Object.keys(pkg.bin)[0])
        .usage('<command> [options]')
        .version(pkg.version)
        .option('-d, --debug', 'output extra debugging')
    
    program.on('option:debug', function(e) {
        if (options.debug) {
            process.env.LOG_LEVEL ='verbose'
        } else {
            process.env.LOG_LEVEL ='info'
        }
        log.level = process.env.LOG_LEVEL;
    } )
    program.on('command:*', function(obj) {
        const registerCommands = program.commands.map(cmd => cmd.name())
        log.error('unknown command:', obj[0]);

        log.success('all register commands: ', registerCommands)
    })


    program
        .command('init [projectName]')
        .option('-f, --force', 'is force to init project')
        .action(init)



    if (process.argv && process.argv.length < 3) {
        return program.outputHelp()
    }
    program.parse(process.argv)
}