# UnitWise 推广 & SEO 落地手册

站点：https://convert.wezzik.com  ·  源码仓库：Swimming-Bird9909/wezzik-unit-converter
本文件给邱总一份「可直接照做」的推广 + 收录清单。代码层面的 SEO 已在本轮改完（见末尾「已上线改动」）。

---

## 一、先把站点交给搜索引擎（最重要，5 分钟）

### 1) Google Search Console（必做）
1. 打开 https://search.google.com/search-console
2. 右上「添加属性」→ 输入 `convert.wezzik.com` → 选「网址前缀」→ 继续
3. 验证方式选 **HTML 标记**：复制 Google 给的 `<meta name="google-site-verification" ...>`，发给我，我帮你插进所有页面 `<head>`（一次性，之后所有页自动带）。
   - 备选：在 Cloudflare 的 wezzik.com 里加一条 TXT 记录验证（更省事，不动代码）。
4. 验证通过后 → 左侧「站点地图」→ 提交：`https://convert.wezzik.com/sitemap.xml`
5. 提交后等几小时，在「网址检查」里贴 `https://convert.wezzik.com/` 点「请求编入索引」。

### 2) Bing Webmaster Tools（必做，顺带覆盖 DuckDuckGo / Yahoo）
1. https://www.bing.com/webmasters → 添加 `convert.wezzik.com`，用 Cloudflare 的 TXT 或 XML 验证都行。
2. 「站点地图」提交 `https://convert.wezzik.com/sitemap.xml`。
3. 开启 **IndexNow**（见下），新页面 Bing 几分钟内就能收录。

### 3) IndexNow（让 Bing/Yandex/Seznam/DuckDuckGo 秒收）
- 在 Bing Webmaster「IndexNow」里生成一把 key（形如 `a1b2c3d4e5f6...`）。
- 把 key 发我，我会在站点根目录放 `<key>.txt` 并接入自动推送（部署时把新 URL 推给 Bing）。
- 不接也可：每次大改后，在 Bing Webmaster 里手动「提交 URL」。

> 注：沙箱环境无法直连 google/bing，上面三步需你在自己浏览器完成；验证所需的 meta/文件我这边都能帮你加好。

---

## 二、各平台发文文案（直接复制发）

### X / Twitter（带图发布，用站点 OG 图更吸睛）
> 🔢 Free unit converter that just works — kg↔lb, °C↔°F, cups↔grams, mph↔km/h. No ads, no signup, instant results.
> Try it: https://convert.wezzik.com
> #unitconverter #cooking #baking #engineering

### LinkedIn（偏实用/专业）
> 做了个免费单位换算工具 UnitWise，覆盖长度/重量/温度/体积/压力/烹饪等 100+ 场景。
> 做菜换算 cups↔grams、跨境发货换算 kg↔lb 特别顺手，纯前端、无注册。
> https://convert.wezzik.com

### Reddit（选对版块，别硬广，当资源分享）
- r/Cooking / r/Baking：「I made a cups↔grams converter that accounts for flour vs sugar weight — handy for following US recipes. [link]」
- r/Metric / r/MapPorn：「Free kg↔lb, km↔mi, °C↔°F converter, no signup [link]」
- r/EngineeringStudents：「Unit converter that works offline in the browser [link]」

### Pinterest（烹饪向，最匹配）
建 Board「Kitchen Conversion Cheat Sheets」，把这几个页做成图钉：
- https://convert.wezzik.com/flour-grams-to-cups.html
- https://convert.wezzik.com/sugar-grams-to-cups.html
- https://convert.wezzik.com/cooking-conversion.html

### Quora（回答式引流）
搜「How many grams in a cup?」「How do I convert kg to lb?」等，回答里自然带上 converter 链接。

### Facebook 群组（跨境电商 / 烘焙 / 海外生活类群组）
「分享个免费换算工具，做跨境发货算 kg/lb、in/cm 很方便：https://convert.wezzik.com」

---

## 三、启动 / 目录平台（一次性提交，长期长尾）
- **Product Hunt**：https://www.producthunt.com → 以「UnitWise — Free unit converter for cooking, shipping & engineering」上线，第一天找朋友点赞。
- **AlternativeTo**：https://alternativeto.net → 搜 Unit Converter，提交 UnitWise 作为替代品。
- **BetaList**：https://betalist.com → 适合早期曝光。
- **Hacker News**（Show HN）：发「Show HN: UnitWise, a free no-signup unit converter (100+ tools)」→ 技术人群精准。
- **SaaSHub / Launching Next**：补充收录，带 dofollow 反链，利于 SEO。

---

## 四、外链 & 合作（SEO 权重核心）
1. 在你已有的跨境 / 电商站点、公众号、知乎主页加 `convert.wezzik.com` 友链。
2. 找 3-5 个相关博客做 guest post 或资源页收录（烹饪博客、跨境电商博客最匹配）。
3. 在 GitHub 仓库 README 留站点链接（已部署，天然 dofollow）。

---

## 五、已上线的代码层 SEO 改动（本轮）
- ✅ 全站补全 `og:image` / `twitter:image`（`summary_large_image` 大图卡）+ `meta robots` + `theme-color` + 字体预连接。
- ✅ 首页加 `WebSite` 结构化数据（品牌 SERP 增强）。
- ✅ 生成品牌社交分享图 `assets/img/og-image.png`（1200×630，分享到 X/微信有图）。
- ✅ 修掉两个死链：新建 `cooking-conversion.html`（聚合 17 个厨房换算，吃「cooking converter」词）、`blog.html`（3 篇实用短文 + 内链）。
- ✅ 两个新页写入 `sitemap.xml`，并在 all-converters 页加 Cooking 卡片加强内链。
- ✅ `robots.txt` 已指向正确 sitemap。

## 六、建议下一步（可选）
- 扩更多长尾页（如更多烹饪密度对、更多「X 是多少 Y」问答页）—— Programmatic SEO 的增量红利最大。
- 接 IndexNow 自动推送 + Google Search Console 验证 meta。
- 加一个轻量站内搜索页，启用 `SearchAction` 富 SERP。
