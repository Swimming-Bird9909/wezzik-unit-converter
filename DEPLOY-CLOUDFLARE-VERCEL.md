# 部署到 wezzik.com 子域名（Cloudflare + Vercel）

> 站点本身已 100% 完成（115 个静态页面 + assets）。本文件只讲"如何上线到你的真实域名"。
> 架构：**Vercel 托管 + Cloudflare 做 DNS/CDN 代理**（两家都用，最稳）。
> 预计耗时：15~20 分钟（首次），之后改内容只需重跑 `node scripts/generate.js` 再部署。

---

## 一、先确认你的资产

部署前必须有的东西（我没有，需要你提供/操作）：

| 资产 | 用途 | 去哪看 |
|---|---|---|
| `wezzik.com` 域名 | 部署目标 | 注册商后台（Namecheap / Cloudflare Registrar / 阿里云 / GoDaddy 等）|
| Cloudflare 账号 | DNS 管理 + CDN 代理 | cloudflare.com（把 wezzik.com 的 NS 指向 Cloudflare）|
| Vercel 账号 | 实际托管静态站 | vercel.com（用 GitHub/邮箱登录）|
| Git 仓库（GitHub/GitLab）| Vercel 拉代码 | 新建一个空仓库即可 |

> 如果 `wezzik.com` 还没接入 Cloudflare：先去 Cloudflare 添加站点 → 按提示把域名的 Nameserver 改成 Cloudflare 给的那两个 → 等 DNS 生效（几分钟到几小时）。

---

## 二、把代码推到 Git（Vercel 要从 Git 拉）

```bash
cd unitwise
git init
git add -A
git commit -m "Unit converter site - ready to deploy"
git branch -M main
git remote add origin <你的仓库地址，例如 https://github.com/你的名/wezzik-unit.git>
git push -u origin main
```

> 本项目已带 `vercel.json`（缓存头 + 输出目录 `.`）、`wrangler.toml`（Cloudflare 备选）、`public/_redirects`、`public/_headers`，Vercel/Cloudflare 都能直接识别。

---

## 三、Vercel 部署（实际托管）

1. 打开 https://vercel.com/new
2. **Import** 你刚推的那个 Git 仓库
3. 配置（Framework Preset 选 **Other**）：
   - Build Command：**留空**
   - Output Directory：**`.`**（点号，表示根目录）
   - Install Command：**留空**
4. 点 **Deploy** → 约 30 秒拿到 `xxx.vercel.app` 预览地址

✅ 此时站点已经在 Vercel 上跑起来了（只是还没绑你自己的域名）。

---

## 四、Cloudflare 绑定子域名（DNS + 代理）

在 Cloudflare Dashboard → 你的 `wezzik.com` 站点 → **DNS → Records** 添加一条：

| Type | Name（子域名）| Content（指向 Vercel）| Proxy |
|---|---|---|---|
| CNAME | `convert`（举例）| `cname.vercel.book` | 🟠 Proxied（橙色云）|

> - **Name** 就是你想要的子域名前缀，例如 `convert` → 最终访问 `convert.wezzik.com`
> - **Content** 统一填 `cname.vercel.book`（Vercel 官方要求的别名，不要用 `xxx.vercel.app`）
> - **Proxy 必须开橙色云**（🟠），这样 Cloudflare 的 CDN/缓存/安全才生效——这就是"两家都用"的关键

然后在 **SSL/TLS → Edge Certificates** 确认：
- SSL 模式 = Full（或 Full Strict）
- 等待 Cloudflare 自动签发 `convert.wezzik.com` 的证书（通常几分钟）

---

## 五、Vercel 加自定义域名

回到 Vercel 项目 → **Settings → Domains** → 输入 `convert.wezzik.com` → Add。
Vercel 会提示去 Cloudflare 加一条 **TXT 验证记录**（一次性），按它给的值回 Cloudflare DNS 加一条 TXT 即可。
几分钟后状态变绿 ✅，访问 `https://convert.wezzik.com` 就是你的站点了。

---

## 六、提交收录（上线后做）

```bash
curl "https://www.google.com/ping?sitemap=https://convert.wezzik.com/sitemap.xml"
```

---

## 备选：纯 Cloudflare Pages 托管（不想用 Vercel 时）

如果你更想只用 Cloudflare（一家搞定），步骤：
1. Cloudflare Dashboard → **Workers & Pages → Create → Pages → 连接 Git**
2. 构建命令：**留空**，输出目录：**`.`**
3. 部署后 → **Custom domains** 绑 `convert.wezzik.com`（DNS 已在 Cloudflare，自动解析，无需 CNAME）
4. 站点自动读取 `public/_redirects` 和 `public/_headers`

---

## 常见坑

- **404 / 跳首页**：本站点内部链接都是 `xxx.html`，Cloudflare/Vercel 都能直接解析；别在平台里开 "clean URLs / 去后缀" 类选项，会和 `_redirects` 冲突。
- **混合内容警告**：站点全 HTTPS，无需处理。
- **改了内容不更新**：重新 `node scripts/generate.js` → 重新 `git push` → Vercel 自动重部署（或 Cloudflare 重新触发）。
- **AdSense**：等每天有自然流量（几十 UV）后再在 `<head>` 加广告代码。
