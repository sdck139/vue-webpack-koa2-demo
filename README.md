# vue-webpack-koa2-demo

一个使用vue+webpack+koa2搭建的简单demo，用于项目初始化

## 项目目录

```
+-backend                         # 后端代码
| +-api                           # 后端API
| +-config                        # 后端配置
| +-define                        # 变量定义
| +-helper                        # 帮助类
| +-model                         # 数据库模板
| +-module                        # 初始中间件启动配置
| +-ssl                           # ssl配置
| +-util                          # 工具方法类
|
+-build                           # 打包构建配置
+-frontend                        # 前端代码
| +-pages                         # 前端页面
| +-components                    # 公用组件
| +-assets                        # 静态文件
| +-styles                        # 通用样式
| +-scripts                       # 前端引用脚本
| | +-axios.js                    # ajax库axios初始化
| | +-router.js                   # 前端路由
| | +-filter.js                   # vue过滤器
| | +-directive.js                # vue自定义指令
| +-entry.js                      # 单页应用js入口
+-dist                            # 构建打包目录
+-logs                            # 日志
+-node_modules                    # node第三方库
+-.eslintrc.js                    # eslint配置文件
+-app.js                          # 服务启动入口
+-package.json                    # npm描述文件

```

## 使用方式

电脑先安装[node](https://npm.taobao.org/mirrors/node)

###下载依赖包

  命令行下进入工程根目录，执行：npm i

### 运行--开发模式

  命令行下进入工程根目录，执行：npm run dev

  如果出现代码检测错误，请按提示修改后再启动

### 打发行包

  命令行下进入工程根目录，执行：npm run build

  项目dist目录下 {{project-name}}-xxx.zip为发行包

### 生产部署

  npm i pm2 -g

  cp {{project-name}}-xxx.zip {{你要部署的目录}}

  unzip {{project-name}}-xxx.zip

  cd {{你要部署的目录}}

  pm2 start app.js -n {{project-name}} -o /dev/null -e /dev/null -- {{node自定义参数，通过process.argv获取}}