# coding=utf-8
"""
JSON 配置加载模块

从 config/settings.json 加载配置，替代 config.yaml。
如果文件不存在，使用默认配置。
"""

import json
import os
from pathlib import Path
from typing import Dict, Any, Optional


def _get_env_bool(key: str, default: bool = False) -> Optional[bool]:
    """从环境变量获取布尔值，如果未设置返回 None"""
    value = os.environ.get(key, "").strip().lower()
    if not value:
        return None
    return value in ("true", "1")


def _get_env_int(key: str, default: int = 0) -> int:
    """从环境变量获取整数值"""
    value = os.environ.get(key, "").strip()
    if not value:
        return default
    try:
        return int(value)
    except ValueError:
        return default


def _get_env_str(key: str, default: str = "") -> str:
    """从环境变量获取字符串值"""
    return os.environ.get(key, "").strip() or default


def get_default_config() -> Dict[str, Any]:
    """获取默认配置"""
    return {
        "VERSION_CHECK_URL": "https://raw.githubusercontent.com/sansan0/TrendRadar/refs/heads/master/version",
        "SHOW_VERSION_UPDATE": True,
        "TIMEZONE": "Asia/Shanghai",
        "REQUEST_INTERVAL": 1000,
        "USE_PROXY": False,
        "DEFAULT_PROXY": "http://127.0.0.1:10801",
        "ENABLE_CRAWLER": True,
        "REPORT_MODE": "current",
        "DISPLAY_MODE": "keyword",
        "RANK_THRESHOLD": 5,
        "SORT_BY_POSITION_FIRST": False,
        "MAX_NEWS_PER_KEYWORD": 0,
        "REVERSE_CONTENT_ORDER": False,
        "ENABLE_NOTIFICATION": True,
        "MESSAGE_BATCH_SIZE": 4000,
        "DINGTALK_BATCH_SIZE": 20000,
        "FEISHU_BATCH_SIZE": 30000,
        "BARK_BATCH_SIZE": 4000,
        "SLACK_BATCH_SIZE": 4000,
        "BATCH_SEND_INTERVAL": 3,
        "FEISHU_MESSAGE_SEPARATOR": "━━━━━━━━━━━━━━━━━━━",
        "MAX_ACCOUNTS_PER_CHANNEL": 3,
        "PUSH_WINDOW": {
            "ENABLED": False,
            "TIME_RANGE": {
                "START": "20:00",
                "END": "22:00"
            },
            "ONCE_PER_DAY": True
        },
        "WEIGHT_CONFIG": {
            "RANK_WEIGHT": 0.6,
            "FREQUENCY_WEIGHT": 0.3,
            "HOTNESS_WEIGHT": 0.1
        },
        "PLATFORMS": [],
        "RSS": {
            "ENABLED": True,
            "REQUEST_INTERVAL": 2000,
            "TIMEOUT": 15,
            "USE_PROXY": False,
            "PROXY_URL": "",
            "FEEDS": [],
            "FRESHNESS_FILTER": {
                "ENABLED": True,
                "MAX_AGE_DAYS": 3
            },
            "NOTIFICATION": {
                "ENABLED": True
            }
        },
        "STORAGE": {
            "BACKEND": "auto",
            "FORMATS": {
                "SQLITE": True,
                "TXT": False,
                "HTML": True
            },
            "LOCAL": {
                "DATA_DIR": "output",
                "RETENTION_DAYS": 0
            },
            "REMOTE": {
                "RETENTION_DAYS": 0,
                "ENDPOINT_URL": "",
                "BUCKET_NAME": "",
                "ACCESS_KEY_ID": "",
                "SECRET_ACCESS_KEY": "",
                "REGION": ""
            },
            "PULL": {
                "ENABLED": False,
                "DAYS": 7
            }
        },
        # Webhook 配置
        "FEISHU_WEBHOOK_URL": "",
        "DINGTALK_WEBHOOK_URL": "",
        "WEWORK_WEBHOOK_URL": "",
        "WEWORK_MSG_TYPE": "markdown",
        "TELEGRAM_BOT_TOKEN": "",
        "TELEGRAM_CHAT_ID": "",
        "EMAIL_FROM": "",
        "EMAIL_PASSWORD": "",
        "EMAIL_TO": "",
        "EMAIL_SMTP_SERVER": "",
        "EMAIL_SMTP_PORT": "",
        "NTFY_SERVER_URL": "https://ntfy.sh",
        "NTFY_TOPIC": "",
        "NTFY_TOKEN": "",
        "BARK_URL": "",
        "SLACK_WEBHOOK_URL": "",
        # 前端配置
        "NEW_THEME_AGE_DAYS": 1,
        # Obsidian 集成
        "OBSIDIAN_EXPORT_PATH": ""
    }


def load_json_config(config_path: Optional[str] = None) -> Dict[str, Any]:
    """
    从 JSON 文件加载配置

    Args:
        config_path: 配置文件路径，默认为 config/settings.json

    Returns:
        包含所有配置的字典
    """
    if config_path is None:
        config_path = "config/settings.json"

    config_file = Path(config_path)

    # 如果配置文件不存在，使用默认配置
    if not config_file.exists():
        print(f"配置文件不存在: {config_path}")
        print("使用默认配置")
        return get_default_config()

    try:
        with open(config_file, "r", encoding="utf-8") as f:
            json_config = json.load(f)

        print(f"配置文件加载成功: {config_path}")

        # 从 JSON 配置构建配置字典
        config = {}

        # 应用配置
        app = json_config.get("app", {})
        config["TIMEZONE"] = _get_env_str("TIMEZONE") or app.get("timezone", "Asia/Shanghai")
        config["SHOW_VERSION_UPDATE"] = app.get("show_version_update", True)

        # 前端配置
        frontend = json_config.get("frontend", {})
        config["NEW_THEME_AGE_DAYS"] = frontend.get("new_theme_age_days", 1)

        # 去重配置（直接传递原始配置）
        if "DEDUPLICATION" in json_config:
            config["DEDUPLICATION"] = json_config["DEDUPLICATION"]
        else:
            # 默认去重配置
            config["DEDUPLICATION"] = {
                "enabled": False,
                "similarity_threshold": 0.8,
                "check_window_days": 30,
                "max_history_records": 3000,
                "filter_deleted": True,
                "filter_archived": False,
                "filter_exported": False,
                "duplicate_action": "keep",
                "method": "hybrid",
                "history_retention_days": 90
            }

        # 报告配置
        report = json_config.get("report", {})
        config["REPORT_MODE"] = _get_env_str("REPORT_MODE") or report.get("mode", "current")
        config["DISPLAY_MODE"] = _get_env_str("DISPLAY_MODE") or report.get("display_mode", "keyword")
        config["RANK_THRESHOLD"] = report.get("rank_threshold", 5)
        config["SORT_BY_POSITION_FIRST"] = _get_env_bool("SORT_BY_POSITION_FIRST") or report.get("sort_by_position_first", False)
        config["MAX_NEWS_PER_KEYWORD"] = _get_env_int("MAX_NEWS_PER_KEYWORD") or report.get("max_news_per_keyword", 0)
        config["REVERSE_CONTENT_ORDER"] = _get_env_bool("REVERSE_CONTENT_ORDER") or report.get("reverse_content_order", False)

        # 爬虫配置
        advanced = json_config.get("advanced", {})
        crawler = advanced.get("crawler", {})
        config["REQUEST_INTERVAL"] = crawler.get("request_interval", 1000)
        config["USE_PROXY"] = crawler.get("use_proxy", False)
        config["DEFAULT_PROXY"] = crawler.get("default_proxy", "")
        config["ENABLE_CRAWLER"] = crawler.get("enabled", True)

        # RSS 配置
        rss_advanced = advanced.get("rss", {})
        rss_json = json_config.get("rss", {})
        rss_proxy = rss_advanced.get("proxy_url", "") or crawler.get("default_proxy", "")
        freshness = rss_json.get("freshness_filter", {})

        config["RSS"] = {
            "ENABLED": rss_json.get("enabled", True),
            "REQUEST_INTERVAL": rss_advanced.get("request_interval", 2000),
            "TIMEOUT": rss_advanced.get("timeout", 15),
            "USE_PROXY": rss_advanced.get("use_proxy", False),
            "PROXY_URL": rss_proxy,
            "FEEDS": [],  # 从 sources.json 读取
            "FRESHNESS_FILTER": {
                "ENABLED": freshness.get("enabled", True),
                "MAX_AGE_DAYS": freshness.get("max_age_days", 3)
            },
            "NOTIFICATION": {
                "ENABLED": rss_advanced.get("notification_enabled", True)
            }
        }

        # 通知配置
        notification = json_config.get("notification", {})
        config["ENABLE_NOTIFICATION"] = _get_env_bool("ENABLE_NOTIFICATION") or notification.get("enabled", True)

        push_window = notification.get("push_window", {})
        config["PUSH_WINDOW"] = {
            "ENABLED": _get_env_bool("PUSH_WINDOW_ENABLED") or push_window.get("enabled", False),
            "TIME_RANGE": {
                "START": _get_env_str("PUSH_WINDOW_START") or push_window.get("start", "20:00"),
                "END": _get_env_str("PUSH_WINDOW_END") or push_window.get("end", "22:00")
            },
            "ONCE_PER_DAY": _get_env_bool("PUSH_WINDOW_ONCE_PER_DAY") or push_window.get("once_per_day", True)
        }

        # Webhook 配置
        channels = notification.get("channels", {})
        feishu = channels.get("feishu", {})
        dingtalk = channels.get("dingtalk", {})
        wework = channels.get("wework", {})
        telegram = channels.get("telegram", {})
        email = channels.get("email", {})
        ntfy = channels.get("ntfy", {})
        bark = channels.get("bark", {})
        slack = channels.get("slack", {})

        config["FEISHU_WEBHOOK_URL"] = _get_env_str("FEISHU_WEBHOOK_URL") or feishu.get("webhook_url", "")
        config["DINGTALK_WEBHOOK_URL"] = _get_env_str("DINGTALK_WEBHOOK_URL") or dingtalk.get("webhook_url", "")
        config["WEWORK_WEBHOOK_URL"] = _get_env_str("WEWORK_WEBHOOK_URL") or wework.get("webhook_url", "")
        config["WEWORK_MSG_TYPE"] = _get_env_str("WEWORK_MSG_TYPE") or wework.get("msg_type", "markdown")
        config["TELEGRAM_BOT_TOKEN"] = _get_env_str("TELEGRAM_BOT_TOKEN") or telegram.get("bot_token", "")
        config["TELEGRAM_CHAT_ID"] = _get_env_str("TELEGRAM_CHAT_ID") or telegram.get("chat_id", "")
        config["EMAIL_FROM"] = _get_env_str("EMAIL_FROM") or email.get("from", "")
        config["EMAIL_PASSWORD"] = _get_env_str("EMAIL_PASSWORD") or email.get("password", "")
        config["EMAIL_TO"] = _get_env_str("EMAIL_TO") or email.get("to", "")
        config["EMAIL_SMTP_SERVER"] = _get_env_str("EMAIL_SMTP_SERVER") or email.get("smtp_server", "")
        config["EMAIL_SMTP_PORT"] = _get_env_str("EMAIL_SMTP_PORT") or email.get("smtp_port", "")
        config["NTFY_SERVER_URL"] = _get_env_str("NTFY_SERVER_URL") or ntfy.get("server_url", "https://ntfy.sh")
        config["NTFY_TOPIC"] = _get_env_str("NTFY_TOPIC") or ntfy.get("topic", "")
        config["NTFY_TOKEN"] = _get_env_str("NTFY_TOKEN") or ntfy.get("token", "")
        config["BARK_URL"] = _get_env_str("BARK_URL") or bark.get("url", "")
        config["SLACK_WEBHOOK_URL"] = _get_env_str("SLACK_WEBHOOK_URL") or slack.get("webhook_url", "")

        # 批量发送配置
        batch_size = advanced.get("batch_size", {})
        config["MESSAGE_BATCH_SIZE"] = batch_size.get("default", 4000)
        config["DINGTALK_BATCH_SIZE"] = batch_size.get("dingtalk", 20000)
        config["FEISHU_BATCH_SIZE"] = batch_size.get("feishu", 30000)
        config["BARK_BATCH_SIZE"] = batch_size.get("bark", 4000)
        config["SLACK_BATCH_SIZE"] = batch_size.get("slack", 4000)
        config["BATCH_SEND_INTERVAL"] = advanced.get("batch_send_interval", 3)
        config["FEISHU_MESSAGE_SEPARATOR"] = advanced.get("feishu_message_separator", "━━━━━━━━━━━━━━━━━━━")
        config["MAX_ACCOUNTS_PER_CHANNEL"] = advanced.get("max_accounts_per_channel", 3)

        # 权重配置
        weight = advanced.get("weight", {})
        config["WEIGHT_CONFIG"] = {
            "RANK_WEIGHT": weight.get("rank", 0.6),
            "FREQUENCY_WEIGHT": weight.get("frequency", 0.3),
            "HOTNESS_WEIGHT": weight.get("hotness", 0.1)
        }

        # 平台配置（已废弃，保留空列表）
        config["PLATFORMS"] = []

        # 存储配置
        storage = json_config.get("storage", {})
        config["STORAGE"] = {
            "BACKEND": _get_env_str("STORAGE_BACKEND") or storage.get("backend", "auto"),
            "FORMATS": {
                "SQLITE": storage.get("formats", {}).get("sqlite", True),
                "TXT": _get_env_bool("STORAGE_TXT_ENABLED") or storage.get("formats", {}).get("txt", False),
                "HTML": _get_env_bool("STORAGE_HTML_ENABLED") or storage.get("formats", {}).get("html", True)
            },
            "LOCAL": {
                "DATA_DIR": storage.get("local", {}).get("data_dir", "output"),
                "RETENTION_DAYS": _get_env_int("LOCAL_RETENTION_DAYS") or storage.get("local", {}).get("retention_days", 0)
            },
            "REMOTE": {
                "RETENTION_DAYS": _get_env_int("REMOTE_RETENTION_DAYS") or storage.get("remote", {}).get("retention_days", 0),
                "ENDPOINT_URL": _get_env_str("S3_ENDPOINT_URL") or storage.get("remote", {}).get("endpoint_url", ""),
                "BUCKET_NAME": _get_env_str("S3_BUCKET_NAME") or storage.get("remote", {}).get("bucket_name", ""),
                "ACCESS_KEY_ID": _get_env_str("S3_ACCESS_KEY_ID") or storage.get("remote", {}).get("access_key_id", ""),
                "SECRET_ACCESS_KEY": _get_env_str("S3_SECRET_ACCESS_KEY") or storage.get("remote", {}).get("secret_access_key", ""),
                "REGION": _get_env_str("S3_REGION") or storage.get("remote", {}).get("region", "")
            },
            "PULL": {
                "ENABLED": _get_env_bool("PULL_ENABLED") or storage.get("pull", {}).get("enabled", False),
                "DAYS": _get_env_int("PULL_DAYS") or storage.get("pull", {}).get("days", 7)
            }
        }

        # 其他配置
        config["VERSION_CHECK_URL"] = advanced.get("version_check_url", "https://raw.githubusercontent.com/sansan0/TrendRadar/refs/heads/master/version")

        # Obsidian 集成
        integrations = json_config.get("integrations", {})
        obsidian = integrations.get("obsidian", {})
        config["OBSIDIAN_EXPORT_PATH"] = obsidian.get("export_path", "")

        return config

    except json.JSONDecodeError as e:
        print(f"配置文件格式错误: {e}")
        print("使用默认配置")
        return get_default_config()
    except Exception as e:
        print(f"加载配置失败: {e}")
        print("使用默认配置")
        return get_default_config()


def save_json_config(config: Dict[str, Any], config_path: Optional[str] = None) -> bool:
    """
    保存配置到 JSON 文件

    Args:
        config: 配置字典
        config_path: 配置文件路径，默认为 config/settings.json

    Returns:
        是否保存成功
    """
    if config_path is None:
        config_path = "config/settings.json"

    config_file = Path(config_path)

    try:
        # 确保目录存在
        config_file.parent.mkdir(parents=True, exist_ok=True)

        # 如果文件已存在，先读取并合并
        if config_file.exists():
            with open(config_file, "r", encoding="utf-8") as f:
                existing_config = json.load(f)
        else:
            existing_config = {
                "app": {},
                "frontend": {},
                "report": {},
                "notification": {
                    "channels": {}
                },
                "integrations": {
                    "obsidian": {}
                },
                "storage": {},
                "advanced": {
                    "crawler": {},
                    "rss": {},
                    "api_server": {},
                    "weight": {},
                    "batch_size": {}
                }
            }

        # 更新配置（只更新非空值）
        # 应用配置
        if "TIMEZONE" in config:
            existing_config["app"]["timezone"] = config["TIMEZONE"]
        if "SHOW_VERSION_UPDATE" in config:
            existing_config["app"]["show_version_update"] = config["SHOW_VERSION_UPDATE"]

        # 前端配置
        if "NEW_THEME_AGE_DAYS" in config:
            existing_config["frontend"]["new_theme_age_days"] = config["NEW_THEME_AGE_DAYS"]

        # 报告配置
        if "REPORT_MODE" in config:
            existing_config["report"]["mode"] = config["REPORT_MODE"]
        if "DISPLAY_MODE" in config:
            existing_config["report"]["display_mode"] = config["DISPLAY_MODE"]
        if "RANK_THRESHOLD" in config:
            existing_config["report"]["rank_threshold"] = config["RANK_THRESHOLD"]
        if "SORT_BY_POSITION_FIRST" in config:
            existing_config["report"]["sort_by_position_first"] = config["SORT_BY_POSITION_FIRST"]
        if "MAX_NEWS_PER_KEYWORD" in config:
            existing_config["report"]["max_news_per_keyword"] = config["MAX_NEWS_PER_KEYWORD"]
        if "REVERSE_CONTENT_ORDER" in config:
            existing_config["report"]["reverse_content_order"] = config["REVERSE_CONTENT_ORDER"]

        # 通知配置
        if "ENABLE_NOTIFICATION" in config:
            existing_config["notification"]["enabled"] = config["ENABLE_NOTIFICATION"]

        # Webhook 配置
        if "FEISHU_WEBHOOK_URL" in config:
            existing_config["notification"]["channels"]["feishu"]["webhook_url"] = config["FEISHU_WEBHOOK_URL"]
        if "DINGTALK_WEBHOOK_URL" in config:
            existing_config["notification"]["channels"]["dingtalk"]["webhook_url"] = config["DINGTALK_WEBHOOK_URL"]
        if "WEWORK_WEBHOOK_URL" in config:
            existing_config["notification"]["channels"]["wework"]["webhook_url"] = config["WEWORK_WEBHOOK_URL"]
        if "TELEGRAM_BOT_TOKEN" in config:
            existing_config["notification"]["channels"]["telegram"]["bot_token"] = config["TELEGRAM_BOT_TOKEN"]
        if "TELEGRAM_CHAT_ID" in config:
            existing_config["notification"]["channels"]["telegram"]["chat_id"] = config["TELEGRAM_CHAT_ID"]
        if "BARK_URL" in config:
            existing_config["notification"]["channels"]["bark"]["url"] = config["BARK_URL"]
        if "SLACK_WEBHOOK_URL" in config:
            existing_config["notification"]["channels"]["slack"]["webhook_url"] = config["SLACK_WEBHOOK_URL"]

        # 存储配置
        if "OBSIDIAN_EXPORT_PATH" in config:
            existing_config["integrations"]["obsidian"]["export_path"] = config["OBSIDIAN_EXPORT_PATH"]

        # 保存到文件
        with open(config_file, "w", encoding="utf-8") as f:
            json.dump(existing_config, f, ensure_ascii=False, indent=2)

        print(f"配置已保存: {config_file}")
        return True

    except Exception as e:
        print(f"保存配置失败: {e}")
        return False
