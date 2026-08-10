# UnitWise — 海外单位换算站点规划

> 目标：用 Programmatic SEO 打法做一个海外单位换算专业站点，6~10 个月内靠 Google 自然流量实现广告变现。
> 落地文件全部在本目录下，全部纯静态、可一键部署到 Cloudflare Pages。

---

## 1. 站点定位

| 项目 | 决策 |
|---|---|
| 站名 | **UnitWise**（首选）/ **Convertly**（备选） |
| 域名建议 | unitwise.app / unitwise.io / unitwise.tools / convertly.app |
| 目标市场 | 全球英文市场（美/英/加/澳/印为主），对工程、烹饪、健身人群精准 |
| 核心模式 | **Programmatic SEO**：一个大模板 + ~500 个长尾换算页 + 类别聚合页 |
| 变现 | Google AdSense（首要）→ Amazon 联盟（厨房秤、量杯、量勺）→ 升级版去广告 |

## 2. 内容架构（先做大词首页，再做长尾页和类别页）

```
站点地图 (Sitemap)
├── 首页 /                                   # 转化页：大词"unit converter" + 入口矩阵
├── 所有单位换算 / All Converters             # 聚合页（分类导航）
│   ├── 长度换算 / length-conversion
│   │   ├── mm to inches / mm-to-inches
│   │   ├── cm to feet / cm-to-feet
│   │   ├── ...（30+ 单位互转）
│   ├── 重量换算 / weight-conversion
│   ├── 温度换算 / temperature-conversion
│   ├── 体积换算 / volume-conversion
│   ├── 压力换算 / pressure-conversion
│   ├── 速度换算 / speed-conversion
│   ├── 面积换算 / area-conversion
│   ├── 能量换算 / energy-conversion
│   ├── 时间换算 / time-conversion
│   ├── 数据存储换算 / data-storage-conversion
│   ├── 烹饪换算 / cooking-conversion
│   │   ├── grams to cups
│   │   ├── butter grams to tablespoons
│   │   └── ...
│   └── 健身与健康 / fitness-health
│       ├── calories burned calculator
│       ├── body fat percentage calculator
│       └── protein intake calculator
├── 关于 / about
├── 联系 / contact
├── 法律 / legal
│   ├── privacy
│   ├── terms
│   └── cookies
└── 博客（可选）/ blog   # 后续扩展，二期
```

**首期上线建议：** 选 **30~60 个最高搜索量的换算对**，对应 **40+ 个静态页面**（约 10 个类别页 + 30~50 长尾页 + 首页 + 法律页），覆盖"工程、烹饪、健身"三个最热赛道，2~3 周内能上线。

## 3. 单一长尾页模板（核心）

每个 `/xxx-to-xxx.html` 都用同一模板，关键内容如下：

1. **H1**：精确长尾（"MM to Inches Converter"）
2. **工具区**：实时换算，输入即换算；单位选择器支持双向；一键复制结果；保留历史 5 条（localStorage）；一键互换单位；点击"换算表"展开 1/10/50/100 速查表
3. **换算公式**：框内显示数学公式与推导
4. **速查表**：1, 5, 10, 50, 100, 500, 1000 的对应值
5. **应用场景**（60 字）：用一段真实使用场景把关键词塞进 LSI
6. **相关换算**：12 个内链到同类别其他换算
7. **FAQ**：4~6 条围绕"how to convert / what's the formula / common mistakes"
8. **Schema**：WebApplication + FAQPage + BreadcrumbList JSON-LD

## 4. SEO 打磨（出海必修）

- **URL 结构**：语义化英文 slug + 短横线（`/kg-to-lbs`，非 `/convert?from=kg&to=lbs`）
- **Meta title**：`<主词> – Fast, Free <主词> Tool | UnitWise`（限 60 字内含关键词）
- **Meta description**：含关键词 + 行动词 + 数字（"Convert X to Y in seconds. Free, no signup."）
- **Canonical**：每个页面 self canonical
- **Open Graph + Twitter Card**
- **JSON-LD**：WebApplication、FAQPage、BreadcrumbList
- **robots.txt + 自动生成 sitemap.xml**
- **Hreflang**：仅 en-US 起步，二期加英式英语/中文/西语
- **Core Web Vitals**：静态 + CSS 内联首屏关键样式，所有图片 `<picture>` 加 `loading="lazy"`，Lighthouse 目标 ≥ 90

## 5. UX 打磨细节（差异化关键）

- 输入即换算（无按钮派），配键盘大数字键盘（移动端）
- 单位互换按钮（两头调转）
- 一键复制 + Toast 提示
- 历史记录（localStorage，可单条删除/全清）
- 暗色模式跟随系统
- 移动端优先的响应式布局（多数用户手机操作）
- 所有数字用千分位逗号，超过 1e6 用科学计数法
- 可访问性：A11y label、键盘可控、对比度 ≥ 4.5
- 离线可用：service-worker 缓存首屏（CDN 命中率提升）

## 6. 法律与合规（出海必备）

- Privacy Policy、Terms of Service、Cookies Policy 三页英文版
- 首页底部 Cookie 同意横幅（GDPR / CCPA）
- 仅使用必要的 Google Analytics（IP 匿名化）+ AdSense
- "Contact us" 邮箱 + 表单（mailto 即可）

## 7. 技术栈

| 维度 | 选型 |
|---|---|
| 形态 | **完全静态站点**（无后端、无 DB、无 SSG 编译依赖） |
| 渲染 | 原生 HTML + 原生 CSS + 原生 JS（无框架，最大化 SEO 和速度） |
| 模板 | `templates/converter.html` 单页面模板，`{title}`、`{slug}`、`{fromUnit}` 等 placeholder |
| 生成工具 | Node 脚本 `scripts/generate.js`：`npm run generate` 输出全部换算页 |
| 资源 | 字体走 Google Fonts、图标走 inline SVG |
| 部署 | Cloudflare Pages（首选，免费、全球 CDN、HTTPS、CDN 缓存秒级生效） |
| 域名 | Cloudflare Registrar 或 Namecheap，先 .app/.io，单年 ~$10~15 |
| 监控 | Google Search Console + GA4 + AdSense |

## 8. 上线节奏（4 周冲刺）

| 周次 | 动作 |
|---|---|
| W1 | 域名+Cloudflare Pages 部署空首页；栏目规划；第一批 30 个长尾页上线 |
| W2 | 扩到 100 个长尾页；接 GA4 + Search Console；提交 sitemap |
| W3 | 接 AdSense；补 FAQ；做内链矩阵；首次内容更新 |
| W4+ | 每 2 周扩充 50~80 页；接入 Affiliate；A/B 测试首页 CTA |

## 9. 商业指标

| 指标 | 6 个月目标 |
|---|---|
| 索引页面 | 400+ |
| 月自然搜索曝光 | 50k+ |
| 月访问 | 5k+ |
| AdSense 首年预期 | $50~$500/月（视流量） |

## 10. 风险与避坑

- **大词"unit converter"别想排上去**：CSDN、Various 等老牌占据前三，主动避开；只做长尾
- **不要做"工具站镜像"**：避免被 Google 判为低质，页面必须有真实场景说明 + FAQ + 表格
- **不要大量外链购买**：自然增长即可
- **AdSense 申请前**：确保 Privacy、Terms、About、Contact 四页面齐全
- **域名问题**：避开含 brand 词；优先 .app/.io/.co

---

## 与本仓库的对应

```
unitwise/
├── index.html                # 首页（首页模板）
├── templates/
│   └── converter.html        # 通用换算页模板
├── assets/
│   ├── css/style.css         # 全站样式（含暗色模式）
│   ├── js/data.js            # 所有单位定义、换算因子、SEO 文本
│   ├── js/engine.js          # 换算引擎（实时）
│   └── js/main.js            # 交互逻辑（复制/历史/深链）
├── scripts/
│   └── generate.js           # Node 脚本：批量产出全部换算页
├── legal/
│   ├── privacy.html
│   ├── terms.html
│   └── cookies.html
├── public/
│   ├── robots.txt
│   └── _redirects
├── package.json              # `npm install && npm run generate` 一键全量生成
└── README.md                 # 部署指南
```

执行顺序：
```
npm install        # 无依赖（写干净脚本不引入重型库）
npm run generate   # 输出 30~500 个换算页到根目录
wrangler pages deploy .   # 一键部署到 Cloudflare Pages
```
