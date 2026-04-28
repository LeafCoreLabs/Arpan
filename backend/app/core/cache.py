import os
import json
import logging
from typing import Optional, Any

logger = logging.getLogger(__name__)

_redis_client = None
_redis_available = False


def _get_redis():
    global _redis_client, _redis_available
    if _redis_client is not None:
        return _redis_client

    redis_url = os.getenv("REDIS_URL")
    if not redis_url:
        _redis_available = False
        return None

    try:
        import redis
        _redis_client = redis.from_url(redis_url, decode_responses=True, socket_timeout=2, socket_connect_timeout=2)
        _redis_client.ping()
        _redis_available = True
        logger.info("Redis connected: %s", redis_url[:30] + "...")
        return _redis_client
    except Exception as e:
        logger.warning("Redis unavailable, running without cache: %s", e)
        _redis_client = None
        _redis_available = False
        return None


def cache_get(key: str) -> Optional[Any]:
    r = _get_redis()
    if not r:
        return None
    try:
        val = r.get(key)
        if val is not None:
            return json.loads(val)
    except Exception:
        pass
    return None


def cache_set(key: str, value: Any, ttl: int = 60):
    r = _get_redis()
    if not r:
        return
    try:
        r.setex(key, ttl, json.dumps(value, default=str))
    except Exception:
        pass


def cache_delete(*patterns: str):
    r = _get_redis()
    if not r:
        return
    try:
        for pattern in patterns:
            if "*" in pattern:
                for key in r.scan_iter(match=pattern, count=100):
                    r.delete(key)
            else:
                r.delete(pattern)
    except Exception:
        pass
