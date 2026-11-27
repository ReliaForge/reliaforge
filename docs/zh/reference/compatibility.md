# 版本与 API

本页列出当前版本执行的核心契约与版本规则。

## 插件 API

在 `manifest.json` 中将 `api_version` 设为 `"v1"`。若填写其他版本值，后端会在导入插件 Python 入口前直接拒绝加载。

## 插件依赖

每项依赖包含目标插件 `id`、可接受的 SemVer `version` 范围，以及可选的 `optional: true` 标记。导入插件代码前，后端会检查缺失的必选提供者、版本不兼容与循环依赖。

提供者插件的 SemVer 版本号代表其导出 Python 服务的契约版本。调用方通过 `context.get_service(...)` 获取必选服务，或通过 `context.try_get_service(...)` 按需获取可选服务。

## 控制台与插件 SDK

控制台调用 `/api/v1` 管理接口，并在 `manifest.json` 声明 `frontend.ui_mode` 为 `"esm"` 时动态加载插件前端产物。请基于 `@reliaforge/plugin-sdk` `^1.1.0` 构建 ESM 插件工作区，以复用宿主控制台的 React 运行时与公共组件。

## 配置与重启

插件环境变量使用 `RELIAFORGE_<PLUGIN_ID>_` 前缀，并以 `__` 表示嵌套字段。在控制台重启插件会重新读取其环境变量配置；修改 Python 源码、前端构建产物、`manifest.json` 或 `enabled_plugins` / `disabled_plugins` 后，需重启后端进程。
