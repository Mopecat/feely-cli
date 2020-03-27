# feely-cli

简单的前端构建工具

## Install

```
  npm install feely-cli -g
```

## Explain

安装后执行

```
feely create
```

后面跟着提示走就可以了~~
目前只有 ts 模板和 vue 模板，后续还会继续增加，以及丰富 `feely-cli` 的功能，有 `idea` 的同学可以 `issues` 里提一下~
模板放在 https://github.com/Mopecat/template 这个仓库里.后续将陆续添加 `react` 的项目模板

## Plan B

关于这个项目的后续优化想法：

1. 现在添加模板文件还有修改项目中的配置文件，导致需要重新发布，这并不合理，应该讲模板的配置文件放在模板的仓库中拉取时解析。

2. 规范化提交注释：应用`commitizen`

3. 现在完全是手动发布，手动书写 `CHANGELOG` 要做到=>

- 根据 `git` 提交信息自动生成`CHANGELOG`

- 通过 `git` 检测文件改动，自动发布

这部分可以应用`lerna`

4. 说明文档写的太过随意了连个图片都没有，太么糙了。

虽然这是一个功能非常简单的小项目，但是这也是我的第一个开源项目，我也想慢慢的完善他，让他变得更加规范，更加好看。一点一点实践起来。

## Logs

- 2020-03-27 增加模板 `es6-project-template` 简单配置了一下`webpack`和`babel`，可用于写一些小 `demo`，不用每次都手动配置一个。
