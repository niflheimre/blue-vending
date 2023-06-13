import moment from 'moment'
import fs from 'graceful-fs'
import path from 'path'

export const writeSequelizeFile = (str: string) => {
  let logpath: string = `${process.env.LOGGING_SQL_PATH || './logs'}/${
    process.env.LOGGING_SQL_NAME ?? 'database_'
  }${moment().format('YYYY_MM')}.log`

  if (!fs.existsSync(path.dirname(logpath))) {
    fs.mkdirSync(path.dirname(logpath))
  } else {
    let log_file = fs.createWriteStream(logpath, { flags: 'a' })
    log_file.write(`${moment()}:${str}` + '\n')
  }
}
