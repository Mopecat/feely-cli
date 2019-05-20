const request = require('request') // 请求
const semver = require('semver') 
const chalk = require('chalk')
const packageConfig = require('../package.json')
module.exports=callback=>{
  request({
    url: 'https://registry.npmjs.org/feely-cli',
    timeout: 1000
  }, (err, res, body) => {
    if (!err && res.statusCode === 200) {
      const latestVersion = JSON.parse(body)['dist-tags'].latest
      const localVersion = packageConfig.version
      if (semver.lt(localVersion, latestVersion)) {
        console.log()
        console.log(chalk.yellow('  有新的版本待更新'))
        console.log()
        console.log('  最新版本:    ' + chalk.green(latestVersion))
        console.log('  当前版本: ' + chalk.red(localVersion))
        console.log()
      }
    }
    callback()
  })
}