# UnitWise

> A free, fast, accurate unit converter. Static-site Programmatic SEO built on a single template.

```
unitwise/
├── index.html                  ← 落地页（大词入口 + 站内搜索 + 类别网格）
├── all-converters.html         ← 聚合页（执行 npm run generate 之后生成）
├── templates/converter.html    ← 通用长尾换算页模板（占位符 {SLUG} 等）
├── assets/css/style.css        ← 全站样式（light/dark + 响应式）
├── assets/js/
│   ├── data.js                 ← 所有单位定义、换算因子、SEO 文本
│   ├── engine.js               ← 实时换算引擎
│   └── main.js                 ← 通用交互
├── scripts/generate.js         ← 一键批量产出全部换算页 + sitemap
├── legal/{privacy,terms,cookies}.html
├── public/{robots.txt,_redirects,_headers}
├── content/                    ← 留给博客二期
├── package.json
├── README.md
└── SITE-PLAN.md                ← 站点规划与商业目标
```

## 一、本地预览

需要 Node.js ≥ 16，无第三方依赖。

```bash
# 1. 复制仓库
cd unitwise

# 2. 生成所有页面（一次产出 60+ 长尾页 + 类别页 + sitemap）
npm run generate

# 3. 本地起静态服务（任选其一）
npm run preview            # python3 -m http.server 8000
# 或者：npx serve .
# 或者：npx http-server -p 8000

# 4. 浏览器打开
open http://localhost:8000/
```

> 注：`index.html` 与 `legal/*` 都已直接写好（不需要生成）；其余长尾页由 `scripts/generate.js` 渲染 `templates/converter.html` 批量产出。

## 二、生成的内容

执行 `npm run generate` 后，**根目录**将新增（**精选 60+ 页**）：

### 长度 length（12）
- `mm-to-inches.html`, `inches-to-mm.html`, `cm-to-inches.html`, `inches-to-cm.html`
- `cm-to-feet.html`, `feet-to-cm.html`, `meters-to-feet.html`, `feet-to-meters.html`
- `km-to-miles.html`, `miles-to-km.html`, `yards-to-feet.html`, `feet-to-inches.html`

### 重量 weight（8）
- `kg-to-lbs.html`, `lbs-to-kg.html`, `grams-to-ounces.html`, `ounces-to-grams.html`
- `kg-to-grams.html`, `pounds-to-stones.html`, `stones-to-kg.html`, `grams-to-pounds.html`

### 体积 volume（12）
- `gallons-to-liters.html`, `liters-to-gallons.html`, `cups-to-ml.html`, `ml-to-cups.html`
- `oz-to-ml.html`, `ml-to-oz.html`, `tablespoons-to-cups.html`, `cups-to-tablespoons.html`
- `tbsp-to-ml.html`, `quarts-to-liters.html`, `pints-to-liters.html`, `cubic-feet-to-cubic-meters.html`

### 温度 temperature（4）
- `celsius-to-fahrenheit.html`, `fahrenheit-to-celsius.html`, `celsius-to-kelvin.html`, `kelvin-to-celsius.html`

### 烹饪 cooking（4）
- `grams-to-cups.html`, `butter-grams-to-tbsp.html`, `flour-grams-to-cups.html`, `sugar-grams-to-cups.html`

### 压力 pressure / 速度 speed / 面积 area / 时间 time / 能量 energy / 数据 data / 角度 angle / 频率 frequency（共 ~20）

### 类别聚合页（13）
- `length-conversion.html`, `weight-conversion.html`, `temperature-conversion.html`, …

### 总览页 + sitemap
- `all-converters.html`, `sitemap.xml`

最终数：**约 65+ HTML + sitemap.xml**。

## 三、扩展更多长尾

打开 `assets/js/data.js`，在 `FEATURED_PAIRS` 数组末尾追加新对象即可：

```js
{ slug: 'yards-to-meters', cat: 'length', from: 'yard', to: 'meter' },
{ slug: 'fathoms-to-feet',   cat: 'length', from: 'fathom', to: 'foot' },  // 需要先在 UNIT_DATA 加单位
```

然后：

```bash
npm run generate
```

立刻产出对应页面，全站导航、相关换算、sitemap 同步刷新。

> 进阶：想批量出"全部单位互转"版（数百页），把 `scripts/generate.js` 改成"遍历每个类别的所有单位 × 全部其他单位，构造双向对"，再调用 `renderOne()` 即可。可在 `--all` 分支启用（首版不启用，避免低质页面过多）。

## 四、上线到 Cloudflare Pages（推荐）

**0. 注册域名**

- Cloudflare Registrar / Namecheap / Porkbun 注册 `unitwise.app` / `.io` / `.tools`。
- 把 NS 改到 Cloudflare（如果在上面注册则自动）。

**1. 准备**

```bash
# 安装 wrangler（一次性）
npm i -g wrangler

# 登录
wrangler login

# 生成全部页面
npm run generate
```

**2. 部署**

**方式 A：直接拖拽**（最快）

1. 打开 https://dash.cloudflare.com → Pages
2. "Create a project" → "Upload assets"
3. 整个 `/unitwise` 文件夹拖入
4. 项目名 `unitwise`，绑定自定义域名（可后绑）
5. 等部署完成（约 30 秒）→ 拿到 `unitwise.pages.dev`

**方式 B：Git 持续部署**（推荐）

```bash
git init && git add . && git commit -m "feat: initial"
gh repo create unitwise --public --source=. --push   # 或自建 repo
```

然后 Cloudflare Pages 选 "Connect to Git" → 选仓库 → 构建设置留空（我们是纯静态，无需 build）→ Output directory 设置为 `/`。

**3. 绑定自定义域名**

Cloudflare Pages → Custom domains → Add `unitwise.app`。

**4. 提交 sitemap 给 Google**

部署完成后：

```bash
curl "https://www.google.com/ping?sitemap=https://unitwise.app/sitemap.xml"
```

并到 [Google Search Console](https://search.google.com/search-console) 验证域名、提交 sitemap。

## 五、接 AdSense（一个月内不要申请，等有 30+ 页 + 流量起步）

Cloudflare Pages → Custom worker 不需要。下面是接 AdSense 的位置：

- **首页**：`<main>` 之后插入脚本。
- **长尾页**：`<div class="uw-section">…</div>` 之间。

把脚本位置留好（见各 HTML 注释）或直接放 `<footer>` 之后即可：

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXX" crossorigin="anonymous"></script>
```

## 六、Roadmap（二期）

- [ ] 真实烹饪食材密度数据库（grams → cups，自动根据食材切换）
- [ ] Blog（针对长尾写"How many calories in …"等）
- [ ] 多语言：de / es / fr / ja
- [ ] PWA / 离线优先
- [ ] Calculator（BMI、mortgage、tip）扩品类

## 七、合规自查清单

- [x] Privacy Policy / Terms / Cookies 三页
- [x] Cookie 同意横幅
- [x] About / Contact 页面
- [x] Canonical URL
- [x] Open Graph + Twitter Card
- [x] JSON-LD（WebApplication + FAQPage + BreadcrumbList）
- [x] `robots.txt` 允许爬虫 + 给出 sitemap
- [x] 自动 `sitemap.xml`
- [x] 缓存头（`_headers`）
- [x] 重定向兼容（`_redirects`）

---

需要扩展数据、加 unit、调视觉、调部署平台 → 直接改代码 + `npm run generate` 即可。
