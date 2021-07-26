const log = require('npmlog')

log.changeLevel = (arg) => {
    if (arg) {
        process.env.LOG_LEVEL = arg;
        log.level = process.env.LOG_LEVEL;
    } else {
        log.level = 'info';
    }
}
log.heading = 'v-create-lp'
log.addLevel('success', 2000, {fg: 'green', bold: true})
module.exports = log;