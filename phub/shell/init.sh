#!/bin/sh

SHELLPATH=$(cd `dirname $0`; pwd)
BASEPATH=$SHELLPATH/../

npm install --global gulp-cli

cd $BASEPATH
npm install

cd $SHELLPATH
# 在有些环境下 gulp-atom-electron 依赖的 rcedit 会安装在和父级同级目录下
cp $SHELLPATH/build/resource/rcedit.exe $BASEPATH/node_modules/rcedit/bin
cp $SHELLPATH/build/resource/rcedit.exe $BASEPATH/node_modules/gulp-atom-electron/node_modules/rcedit/bin
cp $SHELLPATH/build/resource/zh-cn.isl $BASEPATH/node_modules/innosetup-compiler/bin/Languages/

echo 'inited'