

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

# 手动部署

### 安装Node

```shell
# 查看环境变量
echo $PATH

# 下载nvm  （Node管理工具）
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash

# 安装完成后需要重新连接ssh

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



# Docker部署

## 介绍

- Docker 是一个集打包、运行、测试、发布于一体的开放式平台
- 开发过程中可以把基础设施分离出来部署到 Docker
  - DevOps：开发、构建、自动化部署、测试、文档
  - GitLib、Jenkins
  - Nginx、Apache
  - MySQL、MongoDb...
  - 文档管理工具
- 使用 Docker 可以避免复杂的应用环境配置，并以秒级的速度开启
- 支持绝大多数平台，容器的性能开销极低

## 应用场景

- Web 应用的自动化打包和发布
- 自动化测试和持续集成、发布
- 在服务型环境中部署和调整数据库或其他的后台应用

## 核心概念

- Docker Daemon 守护进程
  - Docker Daemon 是 Docker 的守护进程
  - Docker Client 通过命令行与 Docker Daemon 通信完成 Docker 相关操作
- Docker Client 客户端
  - 通过终端和用户交互
  - 终端中输入指令，Docker 客户端把指令传递给 Docker Daemon
- Docker Image 镜像
  - 可以认为是一个最小版本的 Linux 系统的镜像，包含了所需的文件系统和一些配置好的应用
  - 需要通过容器来加载镜像
  - 是静态的，可以和面向对象中类对比
- Docker Container 容器
  - 通过镜像创建一个容器
  - 可以创建多个容器，每一个容器都会开启一个进程，多个容器之间是相互隔离的
  - 是动态的，可以和面向对象的实例对比

## 体系架构

- Docker 使用客户端-服务器（C/S）架构模式，使用远程API来管理和创建 Docker 容器

  <img src="https://s3.ax1x.com/2020/12/13/reVlOx.png" alt="体系结构" style="zoom:150%;" />

## 与虚拟机的区别

- 虚拟机是硬件级虚拟化，每一个虚拟机内部都需要分割系统资源，需要虚拟出虚拟硬件

- Docker 是系统级虚拟化，容器共享系统资源，不会虚拟出硬件

  ![区别](https://s3.ax1x.com/2020/12/13/rm9BSP.png)

## 常用命令

```bash
# 启动
systemctl start docker
# 停止
systemctl stop docker
# 重启
systemctl restart docker
# 开机启动
systemctl enable docker
# 立即运行并开机启动
systemctl enable --now docker
# 在 Docker Hub 查找镜像
docker search nginx
# 查看本地镜像
docker images

# 获取一个镜像
# 如果指定镜像版本 centos:latest, 默认就是最新版本
docker pull centos
# 删除镜像
docker rmi hello-world

# 以 centos 镜像启动一个容器
# 参数说明: -i 交互式操作，-t 终端，centos 镜像名称，/bin/bash 镜像运行以后执行的命令 打开终端 
docker run -it centos /bin/bash
# 不同镜像的用户是不一样的，启动镜像的参数也不同
# 参数说明：-d 后台运行，--name nginx-server 容器的名字
# 说明：-p 映射容器中的端口，宿主机端口:容器端口，nginx 镜像名称
docker run -d --name nginx-server -p 8080:80 nginx

# 查看所有容器
# 不加参数 -a 查看所有运行中的容器
docker ps -a
# 查看运行中容器的状态
docker stats
# 启动容器，参数可以是容器id，或者容器名称
docker start nginx-server
# 停止、重启、删除容器
docker stop nginx-serve
docker restart nginx-serve
docker rm -f nginx-serve
# 清理所有终止的容器
docker container prune
# 进入容器
docker exec -it nginx-server /bin/bash
# 查看容器内部的日志
docker logs -f nginx-server
```

## 部署Nuxt应用

- 创建 Dockerfile

  ```bash
  # build stage
  FROM node:lts-alpine as build-stage
  RUN mkdir -p /app
  COPY . /app
  WORKDIR /app
  RUN npm config set registry https://registry.npm.taobao.org
  RUN npm install
  ENV NODE_ENV=production
  EXPOSE 80
  CMD  [ "npm","start" ]
  ```

- 使用 Dockerfile

  ```bash
  # 使用Dockerfile
  docker build --rm -t realworld:v1.0 .
  # 编译过程中如果遇到 npm install 的时候无法解析 npm 的地址，可以使用宿主机的 network
  docker network ls
  docker build --network host --rm -t realworld:v1.0 .
  # 开启容器
  docker run -itd --name web -p 8082:80 realworld:v1.0
  # 如果无法正常访问，可尝试进入容器看看
  docker run -t -i realworld:v1.0 sh
  ```

# Nginx

## 安装

```shell
# 安装
yum install nginx
# 查看安装目录
which nginx
# 查看版本
nginx -v
# 启动
nginx
# 重新启动
nginx -s reload
# 停止
nginx -s stop
# 检查配置文件是否ok
nginx -t
```

## 浏览器缓存

- 缓存的优点
  - 减少不必要的数据请求，节省带宽
  - 减少服务器的负担
  - 用户体验友好
  - 加快客户端加载网页的速度
- 缓存的缺点
  - 如果服务器资源有更改，浏览器无法及时获取最新内容，因为浏览器会先从本地缓存中读取
- 强缓存
  - 给资源设置一个过期时间，浏览器每次请求都会检查时间是否过期，只有过期才会发送请求到服务器获取最新内容
  - cache-control：max-age=xxx
    - no-store 不缓存 
    - no-cache 不使用强缓存
- 协商缓存
  - 浏览器发送请求，服务器检查资源是否发生改变，如果没有改变，返回304，浏览器将从缓存中直接读取，如果变了（etag或者last-modified），返回200，会将最新的内容直接返回
  - etag
    - 每个文件都有一个etag，文件内容变了就会改变，唯一的。
  - last-modified
    - 文件的修改时间，精确到秒
- Nginx配置缓存

## Nginx配置

- gzip和etag

  ```yaml
  http {
    # 开启gzip
    gzip on;
    # 启用gzip压缩的最小文件；小于设置值的文件将不会被压缩
    gzip_min_length 1k;
    # gzip 压缩级别 1-10 
    gzip_comp_level 2;
    # 进行压缩的文件类型。
    gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;
    # 是否在http header中添加Vary: Accept-Encoding，建议开启
    gzip_vary on;
    # 默认开启
    etag on;
  }
  ```

- 缓存配置

  ```yaml
  server {
  	location ~* \.(html)$ {
      access_log off;
      add_header  Cache-Control  max-age=no-cache;
    }
  
    location ~* \.(css|js|png|jpg|jpeg|gif|gz|svg|mp4|ogg|ogv|webm|htc|xml|woff)$ {
      access_log off;
      add_header    Cache-Control  max-age=360000;
    }
  }
  ```


