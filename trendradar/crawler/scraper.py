# coding=utf-8
"""
网页内容抓取器
"""
from typing import Optional
import requests
from bs4 import BeautifulSoup

def scrape_article_content(url: str, session: requests.Session, timeout: int = 15) -> Optional[str]:
    """
    抓取并解析文章页面的主要文本内容

    Args:
        url: 文章 URL
        session: requests 会话对象
        timeout: 请求超时时间

    Returns:
        提取的文本内容，失败则返回 None
    """
    if not url:
        return None

    try:
        response = session.get(url, timeout=timeout)
        response.raise_for_status()
        response.encoding = response.apparent_encoding # 自动检测并设置编码

        soup = BeautifulSoup(response.text, "html.parser")

        # 尝试多种策略寻找主要内容
        # 策略 1: <article> 标签
        article_tag = soup.find("article")
        if article_tag:
            return article_tag.get_text(separator='\n', strip=True)

        # 策略 2: <main> 标签
        main_tag = soup.find("main")
        if main_tag:
            return main_tag.get_text(separator='\n', strip=True)
            
        # 策略 3: id 或 class 为 "content" 的 div
        content_div = soup.find("div", id="content") or soup.find("div", class_="content")
        if content_div:
            return content_div.get_text(separator='\n', strip=True)

        # 策略 4: id 或 class 为 "main" 的 div
        main_div = soup.find("div", id="main") or soup.find("div", class_="main")
        if main_div:
            return main_div.get_text(separator='\n', strip=True)

        # 策略 5: 聚合所有 <p> 标签的内容
        paragraphs = soup.find_all("p")
        if len(paragraphs) > 5:  # 只有当p标签足够多时才认为有效
            return '\n'.join(p.get_text(strip=True) for p in paragraphs)
            
        # 如果以上都失败，返回 body 的纯文本，这可能是最后的手段，但可能很嘈杂
        return soup.body.get_text(separator='\n', strip=True)

    except requests.Timeout:
        print(f"[Scraper] 抓取超时: {url}")
        return None
    except requests.RequestException as e:
        print(f"[Scraper] 抓取失败: {url} ({e})")
        return None
    except Exception as e:
        print(f"[Scraper] 解析失败: {url} ({e})")
        return None
