#!/usr/bin/env python3
"""IndexNow 提交脚本 — 纯静态站（convert.wezzik.com）

用法:
  python3 tools/submit-indexnow.py --dry-run       # 打印将提交的 URL
  python3 tools/submit-indexnow.py                 # 全量提交 sitemap 所有 URL
  python3 tools/submit-indexnow.py --url https://convert.wezzik.com/blog/foo.html  # 单页增量

前置: 项目根目录需有 <32hex>.txt 密钥文件（内容=key），且该文件已在线上
       https://convert.wezzik.com/<32hex>.txt 可访问（IndexNow 用它验证所有权）。
"""
import os
import re
import sys
import json
import urllib.request
import urllib.error

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # unitwise/
HOST = "convert.wezzik.com"
SITEMAP = f"https://{HOST}/sitemap.xml"
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/124.0 Safari/537.36")

# 自动定位根目录的 <32hex>.txt 密钥文件
key = None
key_file = None
for name in os.listdir(ROOT):
    if re.fullmatch(r"[0-9a-f]{32}\.txt", name):
        with open(os.path.join(ROOT, name)) as f:
            key = f.read().strip()
        key_file = name
        break
if not key:
    print("✗ 未找到 IndexNow 密钥文件（根目录需有 <32hex>.txt）")
    sys.exit(1)

KEY_LOC = f"https://{HOST}/{key_file}"


def fetch_urls():
    req = urllib.request.Request(SITEMAP, headers={"User-Agent": UA})
    data = urllib.request.urlopen(req, timeout=20).read().decode()
    return re.findall(r"<loc>\s*(.*?)\s*</loc>", data)


def post(urls):
    payload = {"host": HOST, "key": key, "keyLocation": KEY_LOC, "urlList": urls}
    body = json.dumps(payload).encode()
    req = urllib.request.Request(
        "https://api.indexnow.org/indexnow",
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        resp = urllib.request.urlopen(req, timeout=20)
        print(f"✓ 提交成功: HTTP {resp.status}, 共 {len(urls)} 个 URL")
        return True
    except urllib.error.HTTPError as e:
        print(f"✗ 提交失败: HTTP {e.code} | {e.read().decode()[:300]}")
        return False


if __name__ == "__main__":
    args = sys.argv[1:]
    if "--url" in args:
        i = args.index("--url")
        urls = [args[i + 1]]
    else:
        urls = fetch_urls()

    if "--dry-run" in args:
        print(f"[dry-run] key={key} | keyLocation={KEY_LOC}")
        print(f"[dry-run] 将提交 {len(urls)} 个 URL:")
        for u in urls:
            print("   ", u)
        sys.exit(0)

    print(f"提交 {len(urls)} 个 URL 到 IndexNow ...")
    print(f"  keyLocation={KEY_LOC}")
    ok = post(urls)
    sys.exit(0 if ok else 1)
