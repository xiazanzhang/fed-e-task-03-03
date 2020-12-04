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

# 发布部署

## 手动部署

### 安装环境

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

### 部署方式

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

### 使用PM2方式启动

```shell
# 安装
npm install --global pm2

# 启动
pm2 start npm -- start

```

### PM2常用命令

| 命令                 | 说明         |
| -------------------- | ------------ |
| pm2 list             | 查看应用列表 |
| pm2 start            | 启动应用     |
| pm2 stop             | 停止应用     |
| pm2 reload           | 重载应用     |
| pm2 restart          | 重启应用     |
| pm2 delete           | 删除应用     |
| pm2 log 应用程序名称 | 查看错误日志 |

# 自动部署

## 常用CI/CD服务

- Jenkins
- Gitlab CI
- GitHub Actions
- Travis CI
- Circle CI
- ....

## 使用GitHub Actions方式

### 环境准备

- Linxu服务器
- 将代码提交到GitHub远程仓库

### 配置GitHub Access Token

- 生成：https://github.com/settings/tokens
- 将生成的Token配置到项目中的Secrets中
- 配置main.yml脚本相关参数信息

![配置](https://s3.ax1x.com/2020/12/04/DqwFit.png)

### 配置GitHub Actions 执行脚本

- 在项目根目录创建.github/workflows目录

- 添加main.yml到workflows目录中

  ```yml
  name: Publish And Deploy Demo
  
  on:
    push:
      # 触发条件
      tags:
        - 'v*'
  
  jobs:
    build-and-deploy:
      runs-on: ubuntu-latest
      steps:
  
      # 下载源码
      - name: Checkout
        uses: actions/checkout@master
  
      # 打包构建
      - name: Build
        uses: actions/setup-node@master
      - run: npm install
      - run: npm run build
      - run: tar -zcvf release.tgz .nuxt static nuxt.config.js package.json package-lock.json pm2.config.json
  
      # 发布 Release
      - name: Create Release
        id: create_release
        uses: actions/create-release@master
        env:
          GITHUB_TOKEN: ${{ secrets.TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          draft: false
          prerelease: false
  
      # 上传构建结果到 Release
      - name: Upload Release Asset
        id: upload-release-asset
        uses: actions/upload-release-asset@master
        env:
          GITHUB_TOKEN: ${{ secrets.TOKEN }}
        with:
          upload_url: ${{ steps.create_release.outputs.upload_url }}
          asset_path: ./release.tgz
          asset_name: release.tgz
          asset_content_type: application/x-tgz
  
      # 部署到服务器
      - name: Deploy
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          password: ${{ secrets.PASSWORD }}
          port: ${{ secrets.PORT }}
          script: |
            cd /root/realworld-nuxtjs
            wget https://github.com/xiazanzhang/realworld-nuxtjs/releases/latest/download/release.tgz -O release.tgz
            tar zxvf release.tgz
            npm install --production
            pm2 reload pm2.config.json
  ```

- 修改配置

- 添加PM2配置文件

  ```json
  {
      "apps": [
          {
              "name": "RealWorld",
              "script": "npm",
              "args": "start"
          }
      ]
  }
  ```

- 提交更新

- 查看自动部署状态

  ![部署状态](https://s3.ax1x.com/2020/12/05/Dq5Lxe.png)

  ![运行状态](https://s3.ax1x.com/2020/12/05/Dq5jrd.png)

- 访问网站

