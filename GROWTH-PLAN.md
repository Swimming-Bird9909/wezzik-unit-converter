# UnitWise 快速提量 + SEO 增长方案
> 站点：https://convert.wezzik.com  ·  更新：2026-08-25

---

## A. 本周可做（快速提量 · 共约 1-2 小时）

### A1. GSC 请求编入索引（最重要 · 10 分钟）
新 4 篇博客 + 3 个新顶级页（cooking / blog / all-converters）在 GSC 手动请求一次，谷歌会优先抓取：

1. 打开 https://search.google.com/search-console（选 `convert.wezzik.com` 资源）
2. 顶部搜索框「检查任何网址」逐个输入：
   - `https://convert.wezzik.com/`
   - `https://convert.wezzik.com/blog.html`
   - `https://convert.wezzik.com/blog/pounds-to-kilograms.html`
   - `https://convert.wezzik.com/blog/cups-to-grams.html`
   - `https://convert.wezzik.com/blog/fahrenheit-to-celsius.html`
   - `https://convert.wezzik.com/blog/metric-vs-imperial.html`
   - `https://convert.wezzik.com/cooking-conversion.html`
3. 每个 → 右侧「请求编入索引」→ 点
4. 谷歌每日有配额（约 10-12 次/资源），分两天做完

### A2. 提交到 Bing Webmaster Tools（5 分钟）
Bing 数据会同步给 DuckDuckGo、Yahoo、Ecosia——一个动作覆盖多个搜索引擎。

1. 打开 https://www.bing.com/webmasters → 添加站点 `https://convert.wezzik.com/`
2. 验证方式选 **Google Analytics**（最简，因为 GA4 已装）
3. 验证通过 → 左侧「站点地图」→ 提交 `https://convert.wezzik.com/sitemap.xml`

### A3. 接入 IndexNow（即时收录 · 推荐 · 10 分钟）
IndexNow 是 Bing/Yandex/Naver 联合的"推送即收录"API，**新 URL 几分钟内被爬**。需要 API key，我帮你接进代码。

**操作**：打开 https://www.bing.com/indexnow → 生成一个 key（如 `a1b2c3d4e5f6...`）→ 把它发我。
我会在 `templates/converter.html` + `scripts/generate.js` 注入一行 `<link rel="indexnow" key="..." />`，每次有新页/修改就自动通知 4 个搜索引擎。

### A4. 在 4 个关键 Reddit 帖文（30 分钟 · 复制即发）
模板见下面 §D。目标子版（账号需满足 karma/年龄要求，建议用现有账号）：
- r/askscience 或 r/NoStupidQuestions：1 帖 temperature 换算（高浏览量、争议少）
- r/Baking 或 r/Cooking：1 帖 cups-to-grams 烘焙换算
- r/Metric 或 r/ImperialSystem：1 帖 metric vs imperial 那个
- r/loseit 或 r/fitness：1 帖 pounds ↔ kilograms 换算

**发帖前**：每个子版必读置顶规则，先在 r/我们站点上无冲突的子版（r/Cooking 比 r/Baking 更宽松）。不要直接推链接，**先回答别人的问题 → 签名带链接**，或正文给价值、最后一句放 URL。

### A5. 立刻 4 条 X/Twitter 帖（10 分钟 · 见 §D 模板）
注册 `@unitwise` 或相似 handle（先查是否被占），用 4 篇博客每篇发一条，带图（用 og-image.png 即可）。

---

## B. 中期可做（本月 · 提升流量基数）

### B1. Pinterest 占位（流量长青）
- 为 4 篇博客各做 1 张 1000×1500 竖图（Pillow 生成或 Canva）
- 每张图：上 1/3 大字标题（"1 lb = 0.45 kg" 等），下 2/3 浅色卡片 + 站点 URL
- 发布到 Pinterest，链接回对应博客页
- 烘焙/cooking 类换算 Pinterest 流量很大，长尾长青

### B2. 更多长尾类别页（程序化 SEO）
当前 13 个类别，可补：
- `engineering-conversion.html`（扭矩、粘度、密度）
- `textile-conversion.html`（织物尺码、缝纫）
- `automotive-conversion.html`（油耗、扭矩、胎压、引擎排量）
- `real-estate-conversion.html`（平方英尺/米、acre/hectare）
- `astronomy-conversion.html`（光年/秒差距/AU）

每页 800-1200 词 + 内部链接到具体 converter。3-5 天能出一批，**一个动作能多几十个索引 URL**。

### B3. 外链与目录提交（30-60 分钟）
去这些站提交（要 Google 账号/邮箱）：
- AlternativeTo：https://alternativeto.net/like/unitwise/ — "alternatives to X" 类目，**高质量 dofollow 外链**
- Product Hunt：https://www.producthunt.com/posts/new — 启动 launch，**带来一波初始流量 + 反向链接**
- SourceForge / G2 / Capterra（仅如果定位为工具）
- Reddit：r/InternetIsBeautiful、r/webdev（如定位合理）

### B4. Quora 答案布局
搜索 "how to convert pounds to kilograms" / "cups to grams for flour" 等 — **用真实账号答 10-20 个问题**，答案中带链接回你博客。
⚠️ Quora 现在反 spam 严，**不要只贴链接**，要真写一段有用的，再签名带链接。

### B5. 加 RSS / Atom feed
让博客订阅者能跟踪。在 `blog.html` 加 `<link rel="alternate" type="application/rss+xml">` 指向 `/blog/feed.xml`。可以用 GitHub Action 或本地脚本生成。

---

## C. 长期可做（本季度 · 3-6 月）

### C1. 多语言版本（流量 ×2-3 潜在）
英语之外的换算搜索量极大：es、fr、de、pt、ja、zh-CN、ar、hi...
- 选 1-2 个目标市场（建议 es 西班牙语 + de 德语最高 ROI）
- 复制页面结构，**不要机翻**（谷歌能识别），用母语写 70 篇左右
- 放 `/es/...` `/de/...` 子目录，加 `hreflang` 标签

### C2. Core Web Vitals 调优
GSC → 体验 → 核心网页指标 → 看 LCP/CLS/INP 报告。当前静态站应该不错，但：
- 字体预加载（preload）
- 图片改 WebP + lazy
- CSS / JS minify

### C3. 规模化长尾（200-500 页）
程式化生成所有单位对（每类别下所有单位两两组合）。当前 98 → 500+ 长尾，覆盖每个可能的查询。

### C4. Email 收集
加一个 "Subscribe for new conversion tools" 表单，**用 buttondown / ConvertKit / Mailchimp 免费层**，积累邮件列表后任何新功能发布都能 1 小时触达所有用户。

### C5. YouTube Shorts / TikTok
把 4 篇博客核心内容（"1 kg = 2.205 lb"、"350°F = 176.7°C"）拍成 30 秒短视频。视频内容搜索量超大，**且能反向给站点引流**。

---

## D. 现成社媒文案（4 篇博客各 1 套）

### D1. Pounds to Kilograms

**X/Twitter（280 字符）：**
```
By international agreement since 1959:

1 lb = exactly 0.45359237 kg

Not an approximation. A fixed constant.

Free converter + complete guide → https://convert.wezzik.com/blog/pounds-to-kilograms.html

#unitconversion #cooking #shipping
```

**LinkedIn（专业长文）：**
```
Most people don't know that 1 pound has been defined as exactly 0.45359237 kg since 1959 — not an approximation, a fixed international constant.

I wrote up the complete guide to pounds ↔ kilograms conversion: the exact formula, a 9-row reference table, the mental math shortcut, and the three common mistakes that trip people up (mass vs. weight, troy pounds, etc.).

The trick that saves me the most time: 1 kg ≈ 2.2 lb. Good enough for any everyday estimate.

→ https://convert.wezzik.com/blog/pounds-to-kilograms.html
```

**Reddit（r/loseit, r/Fitness）：**
```
Title: I made a free pounds ↔ kg converter with the exact (not approximated) factor

Body:
By international agreement since 1959, 1 lb = exactly 0.45359237 kg. The 0.45359… number you see in most calculators is rounded; the real one has 8 digits.

I built a clean free converter + reference guide at https://convert.wezzik.com/blog/pounds-to-kilograms.html — has a 9-row table of common values (1, 5, 10, 20, 50, 100, 150, 200, 220 lb → kg), the formula, and the mental math trick (1 kg ≈ 2.2 lb).

No login, no ads, no tracking beyond aggregate analytics. Let me know if anything is off.
```

---

### D2. Cups to Grams

**X/Twitter：**
```
A cup of flour = 120 g
A cup of sugar = 200 g
A cup of butter = 227 g
A cup of honey = 340 g

Same cup, four different weights. Density matters.

Free chart of 50+ ingredients → https://convert.wezzik.com/blog/cups-to-grams.html

#baking #cooking #recipes
```

**LinkedIn：**
```
If you've ever had a European recipe fail in a US kitchen (or vice versa), it's probably the cup.

A US cup is 236.588 mL. A metric cup (Australia, NZ, most of Europe) is 250 mL. A UK cup is 284 mL. That 5-20% difference is the most common silent cause of recipe failures across borders.

I compiled the exact gram-per-cup values for 50+ common baking ingredients — flour (4 types), sugar (3 types), all the common fats, honey/syrup/molasses, dairy, oats, rice, nuts, leaveners — with a $10 kitchen scale tip at the end.

→ https://convert.wezzik.com/blog/cups-to-grams.html
```

**Reddit（r/Baking, r/Cooking）：**
```
Title: A complete cups-to-grams chart for 50+ baking ingredients (with the $10 scale trick)

Body:
I kept getting inconsistent results converting US recipes to grams (or metric recipes to cups), so I compiled a complete reference. All values are for one US legal cup, measured spoon-and-leveled for dry goods.

The values that surprised me the most:
- Honey weighs 340 g per cup — 70% more than sugar
- A cup of brown sugar (packed) is 220 g, vs. 200 g for white
- Almond flour is only 96 g per cup — much lighter than wheat flour
- Butter is 227 g per cup (two US sticks)

Free, no signup, no ads. Full chart + international cup differences + why a kitchen scale is the only reliable tool:

https://convert.wezzik.com/blog/cups-to-grams.html
```

---

### D3. Fahrenheit to Celsius

**X/Twitter：**
```
°C = (°F − 32) × 5/9

The 32 subtraction comes first. Then 5/9.

That's it. The exact formula, since 1743.

Free chart of 22 common temperatures → https://convert.wezzik.com/blog/fahrenheit-to-celsius.html

#science #temperature
```

**LinkedIn：**
```
There's only one correct formula for Fahrenheit to Celsius:

°C = (°F − 32) × 5/9

Two common mistakes:
1. Doing the multiplication first: °C = °F × 5/9 − 32 (wrong)
2. Subtract 30 instead of 32 and halve (close, but only accurate to ~1°C)

The 32 comes from Daniel Fahrenheit setting 0°F at a brine solution in 1724, not at water's freezing point. So the offset has to be removed before the rescale.

I put together the exact formula, a 22-row reference chart (body temperature, oven settings, weather), the magic −40° crossover, and a mental math trick. Plus the free converter.

→ https://convert.wezzik.com/blog/fahrenheit-to-celsius.html
```

**Reddit（r/askscience, r/NoStupidQuestions）：**
```
Title: The exact Fahrenheit to Celsius formula + 22-row reference chart

Body:
The only correct formula is °C = (°F − 32) × 5/9. The 32 has to be subtracted BEFORE the 5/9 multiplication — reversing the order is a common mistake.

The two scales agree at exactly one point: −40°. So −40°F = −40°C, which is a useful number to remember for any US winter forecast.

I also put together a 22-row reference chart covering normal body temperature, weather, oven settings (from 160°F / 71°C pastry to 500°F / 260°C max home oven), and a mental math trick that's accurate to about 1°C.

Free, no signup:

https://convert.wezzik.com/blog/fahrenheit-to-celsius.html
```

---

### D4. Metric vs Imperial

**X/Twitter：**
```
Of 195 countries in the world, 192 officially use the metric system.

The 3 that don't: United States, Liberia, Myanmar.

The US is the largest by far (335M people). That's why imperial still has global presence despite being a minority.

Full breakdown → https://convert.wezzik.com/blog/metric-vs-imperial.html
```

**LinkedIn：**
```
Of the 195 countries in the world, 192 officially use the metric system. The three that don't are the United States, Liberia, and Myanmar.

The US is unique: it has been officially metric for federal purposes since 1975, but consumer-facing measurement remains imperial — body weight in pounds, road distances in miles, oven temperatures in Fahrenheit, milk in gallons.

I wrote up the full picture: the 192-country list, why the US still resists (estimated $10-20B switching cost, public opinion at ~65% opposed, no federal mandate), the weird hybrid status of the UK (officially metric but still uses miles on road signs and pints in pubs), and practical advice for handling both systems when you travel or cook across borders.

→ https://convert.wezzik.com/blog/metric-vs-imperial.html
```

**Reddit（r/Metric, r/askscience）：**
```
Title: Why only 3 of 195 countries don't use the metric system (and why the US is the last to switch)

Body:
Quick answer: cost ($10-20B to replace all road signs, factory tooling, weather reports, etc.), public opinion (~65% of Americans opposed to full conversion), and the lack of a federal mandate (each state can choose, no one wants to go first).

The 3 countries: United States (335M), Liberia (~5M), Myanmar (~54M). All 3 inherited imperial systems from English colonial influence.

The weird case is the UK: officially metric since 1965, but road signs are still in miles, milk is sold in litres but beer in pints, and people informally say body weight in stones (14 lb) and height in feet and inches.

I put together the full country list, the political/economic reasons behind the US holdout, and a cheat sheet for handling both systems when you travel.

https://convert.wezzik.com/blog/metric-vs-imperial.html
```

---

## E. 监测 / 复盘节奏

- **每天**：GSC 看「效果」曝光/点击变化（数据有 2-3 天延迟）
- **每周**：GA4 看「获客 → 流量获取」看哪些渠道真有流量进来
- **每 2 周**：根据 GSC「效果」中的高曝光低点击查询，**写新内容**精确打那些词
- **每月**：跑一次 site:convert.wezzik.com 看收录量增长

---

## F. 立即可推·优先级

如果只能做 3 件事，**按这个顺序**：
1. **GSC 请求编入索引** 4 篇新博客（10 分钟，最快让谷歌抓）
2. **Bing Webmaster 验证 + 提交 sitemap**（5 分钟，覆盖多引擎）
3. **Reddit 1 篇 + X 4 条**（30 分钟，立刻获得初始外链 + 流量）

剩下时间精力：把 IndexNow key 发我接进去，之后每次新内容上线即时被 4 个搜索引擎抓。
