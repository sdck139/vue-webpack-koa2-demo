'use strict'

const fs = require('fs')
const path = require('path')

const _ = require('lodash')
const log4js = require('koa-log4')
const moment = require('moment')
const schedule = require('node-schedule')
const targz = require('targz')

const LOG_CONFIG = require('../config/_index').log

const DEFAULT_CATEGORY = LOG_CONFIG.defaultCategory
const DEFAULT_LOG_PATH = LOG_CONFIG.defaultLogPath

const LEVELS = ['TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL']

function rebuildLogConfig(inputConfig) {
  const outputConfig = {
    defaultCategory: inputConfig.defaultCategory,
    appenders: [],
    levels: inputConfig.levels,
    replaceConsole: true
  }

  _.each(inputConfig.appenders, (appender) => {
    let consoleLayout = {
      type: 'pattern',
      pattern: '%[[%d] [%p] [%c]%] %m'
    }

    if (appender.category == 'console') {
      consoleLayout = {
        type: 'pattern',
        pattern: `%[[%d] [%p] [${outputConfig.defaultCategory}]%] [console] %m`
      }
    }

    // 如果原appender类型不是console, 则增加输出到console的appender
    if (appender.type != 'console') {
      outputConfig.appenders.push({
        type: 'console',
        category: appender.category,
        layout: consoleLayout
      })
    }

    // 如果原appender类型不为dateFile, 则原样添加该appender
    if (appender.type != 'dateFile') {
      outputConfig.appenders.push(appender)
      return
    }

    // 如果原appender类型为dateFile, 则对其进行处理, 不同级别分不同日志存储
    let filePattern = {
      type: 'pattern',
      pattern: '[%d] [%p] [%c] %m'
    }

    if (appender.category == 'console') {
      filePattern = `[%d] [%p] [${outputConfig.defaultCategory}] [console] %m`
    }

    // 从beginLevel这一级别起的日志进行打印
    const beginLevel = outputConfig.levels[appender.category] || 'INFO'
    outputConfig.levels[appender.category] = beginLevel

    // 某一级别的日志文件将打印所有>=该级别的日志, 如INFO日志文件将打印级别>=INFO的日志
    const logLevels = LEVELS.slice(LEVELS.indexOf(beginLevel.toUpperCase()))
    _.each(logLevels, (level) => {
      outputConfig.appenders.push({
        category: appender.category,
        type: 'logLevelFilter',
        level,
        maxLevel: 'FATAL',
        appender: {
          type: 'dateFile',
          category: appender.category,
          layout: filePattern,
          pattern: '-yyyy-MM-dd.log',
          alwaysIncludePattern: true,
          filename: path.join(DEFAULT_LOG_PATH, `${appender.category}-${level}`)
        }
      })
    })
  })

  return outputConfig
}

function getLogger(categoryName) {
  const args = Array.prototype.slice.call(arguments)
  const filenameRegexp = /^[\\/](\S+)\.(\w+?)$/

  if (args.length < 2) {
    args.unshift(DEFAULT_CATEGORY)
  }
  categoryName = args[0]
  if (typeof args[1] === 'string') {
    args[1] = args[1].replace(process.cwd(), '')
  }

  let prefix = ''
  for (let i = 1; i < args.length; i++) {
    let arg = args[i]
    if (filenameRegexp.test(arg)) {
      arg = arg.replace(filenameRegexp, '$1').replace(/\\/g, '/')
    }
    prefix += arg
    if (i !== args.length - 1) {
      prefix += '] ['
    }
  }

  const logger = log4js.getLogger(categoryName)
  const pLogger = {}
  _.forIn(logger, (value, key) => {
    pLogger[key] = value
  })

  _.each(LEVELS, (item) => {
    item = item.toLowerCase()
    pLogger[item] = function() {
      let p = ''
      if (args.length > 1) {
        p = `[${prefix}] `
      }

      if (args.length) {
        arguments[0] = p + arguments[0]
      }

      logger[item].apply(logger, arguments)
    }
  })
  return pLogger
}

function cleanLogs() {
  const logger = getLogger(__filename)

  // 删除超期的日志
  function deleteLogs() {
    const keepDate = moment().subtract(LOG_CONFIG.logKeepDays || 30, 'day').format('YYYY-MM-DD')

    fs.readdir(DEFAULT_LOG_PATH, (err, files) => {
      if (err) {
        logger.error('Delete logs when read dir error:', err)
        return
      }

      const re = /.*-(20\d\d-\d\d-\d\d)\.log.*/
      _.each(files, (file) => {
        const matches = re.exec(file)

        if (matches && matches[1] < keepDate) {
          logger.info('Try delete log:', file)

          fs.unlink(`${DEFAULT_LOG_PATH}/${file}`, (unlinkErr) => {
            if (unlinkErr) {
              logger.error('Delete log %s error:', file, unlinkErr)
            } else {
              logger.info('Delete log %s success', file)
            }
          })
        }
      })
    })
  }

  // 压缩今天之前的日志
  function zipLogs() {
    const today = moment().format('YYYY-MM-DD')

    fs.readdir(DEFAULT_LOG_PATH, (err, files) => {
      if (err) {
        logger.error('Zip logs when read dir error:', err)
        return
      }

      const re = /.*-(20\d\d-\d\d-\d\d)\.log$/

      // 每天的多个日志文件合成一组
      const fileGroupMatches = _.groupBy(files, (file) => {
        const matches = re.exec(file)
        return matches ? matches[1] : ''
      })

      _.each(fileGroupMatches, (groupFiles, day) => {
        if (day && day < today) {
          logger.info('Try zip logs:', groupFiles.join(' '))

          // 压缩一日的日志
          targz.compress({
            src: DEFAULT_LOG_PATH,
            dest: path.join(DEFAULT_LOG_PATH, `${DEFAULT_CATEGORY}-${day}.log.tar.gz`),
            tar: {
              entries: groupFiles.slice(0)
            },
            gz: {
              level: 9,
              memLevel: 9
            }
          }, (zipErr) => {
            if (zipErr) {
              logger.error('Zip logs error:', zipErr)
            } else {
              logger.info('Zip logs success:', groupFiles.join(' '))

              // 删除已被压缩的日志
              _.each(groupFiles, (file) => {
                fs.unlink(`${DEFAULT_LOG_PATH}/${file}`, (unlinkErr) => {
                  if (unlinkErr) {
                    logger.error('Zip Log when delete log %s error:', file, unlinkErr)
                  } else {
                    logger.info('Zip Log when delete log $s success', file)
                  }
                })
              })
            }
          })
        }
      })
    })
  }

  deleteLogs()
  zipLogs()
}

log4js.configure(rebuildLogConfig(LOG_CONFIG))
schedule.scheduleJob('5 0,1 * * *', cleanLogs)

module.exports = getLogger
