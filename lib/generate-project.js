const Metalsmith=require('metalsmith')  // 渲染文件用
const inquirer=require('inquirer')  // 命令行交互
const chalk=require('chalk') // 高亮提示打印信息
const path=require('path')
const ora=require('ora') // 进度条
const ask = require('./ask.js')
const Handlebars = require('handlebars')




module.exports=(tmpPath)=>{
  const metalsmith=Metalsmith(tmpPath)
  const opts = options(tmpPath)
  // 在构建前执行一些函数
  inquirer.prompt([{
    type:'input',
    name:'destDirName',
    message:'请输入文件名称',
    default:'feely-project'
  },{
    type:'input',
    name:'destination',
    message:'请输入生成项目路径',
    default:process.cwd()
  }]).then(answer=>{
    //项目生成路径
    const destination=path.join(transformIntoAbsolutePath(answer.destination),answer.destDirName)
    
    //加入新的全局变量
    Object.assign(metalsmith.metadata(),answer)
    console.log(`${chalk.green('请填入项目信息~')}`)
    metalsmith
    .source('.')
    .destination(destination)
    .clean(false)
    .use(getInfo(opts.prompts))
    .use(renderTemplateFiles())
    .build(function(err) { 
      if (err) throw err
      if (typeof opts.complete === 'function') {
        const data =Object.assign(metalsmith.metadata(), {
          destDirName: answer.destDirName
        }) 
        const helpers = { chalk }
        opts.complete(data, helpers)  // 判断meta.js中是否定义了构建完成后要执行的函数 这里是判断是否执行自动安装依赖
      } else {
        console.log('complete is not a function')
      }
      
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

  /**
 * 这里通过这个函数返回一个metalsmith的符合metalsmith插件格式的函数
 * 第一个参数fils就是 这个模版下面的全部文件
 * 第二个参数ms就是元数据这里我们的问题以及回答会已键值对的形式存放在里面用于第二个插件渲染模版
 * 第三个参数就是类似 next的用法了 调用done后才能移交给下一个插件运行
 * ask函数则在另外一个js文件中
 */
function getInfo (prompts) {
  return (fils, ms, done) => {
    ask(prompts, ms.metadata(), done)
  }
}

/**
 * render函数则是通过我们第一个插件收集这些问题以及回答后
 * 然后渲染我们的模版
 */
function renderTemplateFiles () {
  return (files, ms, done) => {
    const keys = Object.keys(files)  // 获取模版下的所有文件名
    keys.forEach(key => {  // 遍历对每个文件使用handlerbars渲染
      const str = files[key].contents.toString()
      let t = Handlebars.compile(str)
      let html = t(ms.metadata()) // 过滤填入数据
      files[key].contents = new Buffer.from(html)  // 渲染后重新写入到文件中
    })
    done() // 移交给下个插件
  }
}

/**
 * options内容比较简单
 * 就是用于用来获取 meta.js 里面的配置
 */
function options (dir) {
  const metaPath = path.join(dir, 'meta.js')
  const req = require(metaPath)
  let opts = {}
  opts = req
  return opts
}