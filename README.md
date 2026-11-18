# 我的 Clash 共享规则

## 日常修改

在已连接 GitHub 插件的 ChatGPT 中说：

> 请修改 znhflyl/my-clash-rules，把 example.com 设为直连（或代理）。先读取两份规则文件，保留其他条目，提交后回读验证，并提供提交链接。

- `personal-direct.yaml`：直连规则。
- `personal-proxy.yaml`：代理规则。
- `shared-rules.js`：客户端一次性接入脚本，不包含节点或订阅凭据。

客户端必须同时定义并引用这两个 rule-provider；只更新 GitHub 文件，不会自动补齐旧配置缺失的引用。规则内容变更不需要重新导入整个配置。

## 更新与优先级

已接入的客户端在内核运行时按 3600 秒更新规则库。需要立即生效时，打开客户端的规则库/外部资源，更新两份规则库。iOS 后台更新时机受系统和客户端运行状态影响。

保留设备原有 DIRECT / REJECT 例外，再匹配共享直连、共享代理，最终默认直连。设备本地例外优先；如果云端改动未生效，应核对本地更高优先级的规则。

不要把机场订阅链接、节点密码、令牌或工作内网信息提交到这个公开仓库。

## 当前部署记录

2026-11-10：已补齐 GitHub App 对本仓库的安装授权，连接器创建及更新文件成功并已回读。Mac 的 Clash Verge 与 iPhone 的 Clash 均已验证从云端加载 personal-direct 8 条、personal-proxy 132 条。其他设备应分别核验，不能把云端提交成功视为全部设备已经生效。

## Apple 登录与 Xcode 开发者服务

2026-11-16：新增 `apple-developer-proxy.yaml`，覆盖 Apple 账号认证、Xcode 团队查询及签名服务的 8 条域名规则。`shared-rules.js` 已增加对应 provider，并将它置于设备本地的 `apple.com DIRECT` 等规则之前。普通 Apple/iCloud 分流继续沿用各设备原设置；认证服务为多个 Apple 产品共用，并非仅供 Xcode 使用。

已接入旧脚本的设备需要更新桥接脚本才能引用这个新规则库，仅刷新原有 personal-proxy 不会加载它。Mac 已同步本地脚本、对应 DNS 策略和规则缓存，核实运行内核加载 8 条，开发者服务返回 HTTP 200。其他设备本次未修改。

## Claude 规则模式修复（2026-11-18）

新增 `claude-proxy.yaml`，覆盖 Claude、Anthropic 的站点、登录/API 与相关子域名。共享脚本在设备原有 DIRECT / REJECT 规则之前优先应用 `RULE-SET,claude-proxy,PROXY`，以免设备本地较宽泛的直连规则覆盖 Claude。保留原 `personal-proxy.yaml` 内的 Claude 条目，兼容尚未升级脚本的设备。

**客户端操作：** 已接入旧版 `shared-rules.js` 的设备需要重新加载/应用最新共享脚本，再更新外部规则库。仅刷新旧规则库不会自动增加新 provider。请在 Clash 连接日志中检查 `claude.ai`、`platform.claude.com`、`api.anthropic.com` 等域名实际命中 `claude-proxy → PROXY`；若依然显示地区受限，再核查节点出口所在地、DNS 与 IPv6 泄漏，以及是否存在规则前置、其他代理或客户端缓存。仓库改动本身不代表设备端已验证成功。
