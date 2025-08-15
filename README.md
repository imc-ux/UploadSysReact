# UploadSysReact

[![antd v4.22.7](https://img.shields.io/badge/antd-v4.22.7-f1b8e4.svg)](https://ant.design/docs/spec/introduce)
[![react v18.3.1](https://img.shields.io/badge/react-v18.3.1-f2debd.svg)](https://react.dev/learn)
[![typescript v5.4.5](https://img.shields.io/badge/typescript-v5.4.5-f1f1b8.svg)](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-4.html)

## What is it?

**UploadSysReact** 包含了 UX 上传系统菜单、以及原 React 项目的在线转换工具、权限管理页面、角色管理页面和技术分享页面。

## Table of Contents

- [Technologies](#Technologies)
- [Development](#Development)
- [Production](#Production)
- [Modules](#)
  - menu
  - online conversion tools
  - permission management
  - pages and role management pages
- [links](#)
  - [开发计划](docs/TodoList.md)
  - [历史记录](docs/CHANGELOG.md)

```
cd existing_repo
git remote add origin http://109.14.20.46:8099/ux/UploadSysReact.git
git branch -M main
git push -uf origin main
```

## Technologies

- [React](https://react.dev/learn)
- [TypeScript](https://www.typescriptlang.org/)
- [Antd Design](https://ant.design/docs/react/introduce-cn)
- [react-mustache-template-component](https://github.com/j3lte/react-mustache-template-component)
- [i18next](https://www.i18next.com/)

## Development

- pull repository

```sh
git init
git remote add origin http://109.14.20.46:8099/ux/UploadSysReact.git
git pull origin main
```

- dependencies installation

```sh
npm install
```

- local testing

```sh
npm run start
```

- push your changes

```sh
git init
git add file
git commit -m "modify information"
git branch -M main
git remote add origin http://109.14.20.46:8099/ux/UploadSysReact.git
git push -u origin main
```

本地访问路径：<br>
菜单： [http://127.0.0.1:8898/index.html](http://127.0.0.1:8898/index.html)<br>
在线转换工具：[http://127.0.0.1:8898/toolsIndex.html#/main](http://127.0.0.1:8898/toolsIndex.html#/main)<br>
权限管理：[http://127.0.0.1:8898/toolsIndex.html#/permission](http://127.0.0.1:8898/toolsIndex.html#/permission)<br>
角色管理：[http://127.0.0.1:8898/toolsIndex.html#/role](http://127.0.0.1:8898/toolsIndex.html#/role)<br>
技术分享：[http://127.0.0.1:8898/toolsIndex.html#/share](http://127.0.0.1:8898/toolsIndex.html#/share)

## Production

```sh
npm run build
```

---

[Go to Top](#Table-of-Contents)
