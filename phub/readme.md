# 项目名称
`phub` 全称为 `product hub` 意为产品中心。

# 项目初始化步骤
1. `BASE_PATH/shell/init.sh` 安装项目依赖包及初始化相关操作
1. 初始化完成后可把 `electron-v1.3.4-win32-ia32.zip` 和 `electron-v1.3.4-win32-x64.zip` 
(对应打包要使用的 `electron`版本) 拷贝到 `C:\Users\技术\AppData\Local\Temp\gulp-electron-cache`
（当前用户目录下） 下，以方便最后打包时使用（免去从 github 上下载过程）
**！！此过程也可省略，打包时自动从网络下载相应的依赖文件**

# 项目开发注意事项
## 启动
> 项目现在涉及到几个页面共存，为了不影响其它页面的启动调试，现可以通过命令行启动参数动态调整启动页面。命令如：`electron source/ [?db要启动的页面名]`
* 启动首页 `electron source/`
* 启动数据库展示 `electron source/ db`

## 打包
1. 进入 `shell/build` 目录下
2. 运行 `gulp` 命令，在 `release` 目录下生成相应安装包
