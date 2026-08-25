# UnitWise 数据查看指南（convert.wezzik.com）

> 更新：2026-08-24。GA4 已正式接入（真实 ID `G-MBNPYB5FJ7`），Cloudflare 机器人挑战已关闭，站点可被正常抓取与统计。

## 一、网址
- 正式站点：**https://convert.wezzik.com**
- 查谷歌是否收录：在 Google 搜索框输入 `site:convert.wezzik.com`

## 二、看浏览量 / 用户行为（GA4，已上线）
1. 打开 **https://analytics.google.com**
2. 左下角选你建的数据流（属性应为 `convert.wezzik.com` / 衡量 ID `G-MBNPYB5FJ7`）。
3. 常用报告：
   - **实时（Realtime）**：刚有访客时立刻能看到，用来验证统计是否在工作（部署后等 10–30 分钟再访自己的站，看实时里有没有出现）。
   - **报告 → 获客 → 流量获取**：看访客从哪来（自然搜索 / 社交 / 直接）。
   - **报告 → 互动 → 网页和屏幕**：看哪些换算页最受欢迎。
   - **报告 → 技术 → 网站速度**：看加载性能。
4. 数据通常部署后 **24–48 小时** 内开始出现稳定报表；实时报告几分钟即可见。

## 三、看谷歌搜索曝光 / 点击 / 排名（Google Search Console，待你验证）
> 这一步还没做，需要你在浏览器里验证站点所有权。

1. 打开 **https://search.google.com/search-console**
2. 添加资源 → 网址前缀 → 填 `convert.wezzik.com`。
3. 验证方式选 **DNS**（推荐）：复制 GSC 给的那串 `google-site-verification=xxxx`，发给我，我用 Cloudflare DNS token 帮你加一条 TXT 记录，无需改代码。
4. 验证通过后：
   - 左侧 **效果（Performance）**：看展示次数、点击次数、平均排名、热门查询词。
   - 左侧 **索引 → 站点地图**：提交 `https://convert.wezzik.com/sitemap.xml`。
   - 左侧 **索引 → 网页**：看谷歌已收录多少页、有无抓取错误。

## 四、看必应收录（可选）
- **https://www.bing.com/webmasters** 同样添加站点、提交 sitemap。Bing 收录后通常会同步给 Yahoo / DuckDuckGo。

## 五、当前已完成的 SEO / 统计工作
- ✅ 全站 117 个页面接入 GA4（真实 ID 已生效）
- ✅ Cloudflare 机器人挑战已关闭（首页真实 200，可被抓取）
- ✅ 全站社交 / 爬虫元标签、结构化数据（WebSite/WebPage/Breadcrumb/FAQ）
- ✅ 社交分享大图 `og-image.png`（1200×630）可访问
- ✅ 死链修复（cooking / blog 页）+ 两页入 sitemap（共 120 条 URL）
- ⏳ 待办：GSC 验证 + 提交 sitemap（需你给验证字符串）

## 六、预期时间线（实话）
新站从「谷歌开始收录」到「有稳定浏览量和排名」通常需要 **数周～数月**，不是改完立刻涨。优先级：
1. 关挑战（已做）→ 站点可被抓
2. GA4（已做）→ 看清流量
3. GSC 提交 sitemap（你给验证串后我做）→ 让谷歌知道全站 120 页
4. 之后才是内容厚度、外链、长尾词的慢功夫
