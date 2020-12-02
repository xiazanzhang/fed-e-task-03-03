# 安装环境

## Linux服务器安装NodeJS

```shell
# 查看环境变量
echo $PATH

# 下载nvm  （Node管理工具）
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash

# 重新连接ssh
# 查看版本号
nvm --version

# 安装Node.js lts
nvm install --lts

# 安装pm2 (Node进程管理器)
npm i pm2 -g
```

# 打包NuxtJS应用

## 命令

- next
  - 启动一个热加载的Web服务器（开发模式）
- nuxt build
  - 利用webpack编译应用，压缩JS和CSS资源（发布用）
- nuxt start
  - 以生产模式启动一个Web服务器（需要先执行next build）
- nuxt generate
  - 编译应用，并根据路由配置生成对应的HTML文件（用于静态站点部署）

# NuxtJS应用发布部署

## 最简单的部署方式

- 配置Host+Port

  - 在nuxt.config.js下配置server

    ```json
      server: {
        host: '0.0.0.0',
        port: 3000
      }
    ```

- 压缩发布包

  - 将.nuxt文件夹、static文件夹、package.json、package-lock.json打包压缩成发布包

- 把发布包传到服务器

  - 使用scp命令上传到服务器：```scp .\realworld-nuxtjs.zip root@118.89.22.105:/root/realworld-nuxtjs```

- 解压

  - 使用ssh命令连接服务器：```ssh root@118.89.22.105```
  - 使用unzip命令进行解压：```unzip realworld-nuxtjs.zip```

- 安装依赖

  - npm i

- 启动服务

  - npm start

## 使用PM2方式启动

```shell
# 安装
npm install --global pm2

# 启动
pm2 start npm -- start

```

### 常用命令

| 命令                 | 说明         |
| -------------------- | ------------ |
| pm2 list             | 查看应用列表 |
| pm2 start            | 启动应用     |
| pm2 stop             | 停止应用     |
| pm2 reload           | 重载应用     |
| pm2 restart          | 重启应用     |
| pm2 delete           | 删除应用     |
| pm2 log 应用程序名称 | 查看错误日志 |