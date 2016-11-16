// gulp压缩js，此js文件必须没有语法错误；（所以不能将json格式，需要用括号包含起来）
'# git add 指令
* [参考资料](https://git-scm.com/docs/git-add)

## git add 常用指令： 
* git add a.txt
  * 提交指定文件代码到暂存区

* git add *.txt
  * 提交所有txt后缀的文件到暂存区

* git add a_file/*
  * 提交a_file 文件夹下的所有文件到暂存区~test

* git add *
* git add .
  * 提交**当前路径**下的所有文件到暂存区(包括子目录，但不包括父级以上目录)

* git add -A
  * 最常用的git 指令， 提交所有 新增、删除、修改到暂存区(包括子目录，且包括父级以上目录)

* PS：当合并代码产生冲突时，手动解决完冲突后，通过 git add 告诉git已解决完冲突，否则无法执行其他git指令；


## 相关指令：
* [git_commit.md](https://github.com/wteam-xq/testGit/blob/master/learn_log/git_commit.md) 提交代码（到本地仓库）： 代码存入**暂存区**后，下一操作一般是存入**本地仓库**； 

* [git_status.md](https://github.com/wteam-xq/testGit/blob/master/learn_log/git_status.md) 查看当前代码状态： 方便查看`git add`前后的代码变化；'