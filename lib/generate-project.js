const Metalsmith=require('metalsmith')  // 渲染文件用
const inquirer=require('inquirer')  // 命令行交互
const chalk=require('chalk') // 高亮提示打印信息
const path=require('path')
const ora=require('ora') // 进度条




module.exports=(tmpPath)=>{
  const metalsmith=Metalsmith(tmpPath)
  inquirer.prompt([{
    type:'input',
    name:'name',
    message:'请输入项目名称',
    default:'feely-project'
  },{
    type:'input',
    name:'destination',
    message:'请输入生成项目路径',
    default:process.cwd()
  }]).then(answer=>{
    //项目生成路径
    const destination=path.join(transformIntoAbsolutePath(answer.destination),answer.name)
    const spinner = ora('生成中...').start()
    //加入新的全局变量
    Object.assign(metalsmith.metadata(),answer)
    spinner.start()

    metalsmith
    .source('.')
    .destination(destination)
    .clean(false)
    .build(function(err) {      
      spinner.stop()
      if (err) throw err
      console.log()
      console.log(chalk.green('构建完成'))
      console.log()
      console.log((`${chalk.green('去=>')} ${destination} ${chalk.green('愉快的开始coding吧~')}`))
      console.log()
    })
  })
}

  /**
   * 将路径转化为绝对路径
   * @param {String} localPath 本地路径
   */
  function transformIntoAbsolutePath(localPath){
    if(typeof localPath === 'string'){
        return path.isAbsolute(localPath)?localPath:path.join(process.cwd(),localPath)
      }
      return localPath;
  }
