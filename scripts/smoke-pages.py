"""Read-only smoke checks for Sala de Calma e Estudo Cloudflare Pages deployments."""

from __future__ import annotations

import json
import sys
import time
import urllib.error
import urllib.request
from urllib.parse import urlparse


def fetch(url: str) -> tuple[int, bytes]:
    request = urllib.request.Request(
        url,
        headers={"User-Agent": "Sala de Calma e Estudo-deployment-smoke/1.0", "Accept": "application/json,text/html"},
    )
    with urllib.request.urlopen(request, timeout=20) as response:
        return response.status, response.read(1_000_000)


def main() -> int:
    if len(sys.argv) != 2:
        print("Uso: python scripts/smoke-pages.py https://<ambiente>.pages.dev")
        return 2

    base_url = sys.argv[1].rstrip("/")
    parsed = urlparse(base_url)
    if (
        parsed.scheme != "https"
        or not parsed.hostname
        or not parsed.hostname.endswith(".pages.dev")
        or parsed.path
        or parsed.query
        or parsed.fragment
    ):
        print("Destino recusado: use somente a URL Pages aprovada da Sala de Calma e Estudo.")
        return 2

    root_url = base_url + "/"
    api_url = base_url + "/api/engagement"
    last_error = "sem resposta"
    for attempt in range(24):
        try:
            status, body = fetch(root_url)
            if status != 200 or b"<html" not in body.lower():
                last_error = f"home respondeu HTTP {status} ou não contém HTML"
                raise RuntimeError(last_error)

            status, body = fetch(api_url)
            if status != 200:
                last_error = f"/api/engagement respondeu HTTP {status}"
                raise RuntimeError(last_error)
            payload = json.loads(body)
            if not isinstance(payload, dict) or not isinstance(payload.get("items"), list):
                last_error = "/api/engagement devolveu uma resposta inesperada"
                raise RuntimeError(last_error)
            print(f"OK: {root_url} respondeu HTTP 200 com HTML.")
            print(f"OK: {api_url} respondeu HTTP 200; D1 e secret estão disponíveis.")
            return 0
        except (urllib.error.URLError, TimeoutError, RuntimeError, json.JSONDecodeError) as error:
            last_error = str(error)
            print(f"Aguardando deploy/configuração ({attempt + 1}/24): {last_error}")
            if attempt < 23:
                time.sleep(15)

    print(f"Falha no smoke check após 6 minutos: {last_error}")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
