import abc
import os
import json
import urllib.request
from app.core.config import Config

class AIProvider(abc.ABC):
    @abc.abstractmethod
    def generate_text(self, prompt: str) -> str:
        pass

class GroqProvider(AIProvider):
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.url = "https://api.groq.com/openai/v1/chat/completions"

    def generate_text(self, prompt: str) -> str:
        if not self.api_key:
            raise ValueError("Groq API key not configured")
        payload = json.dumps({
            "model": "llama-3.3-70b-versatile",
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.7
        }).encode("utf-8")
        req = urllib.request.Request(self.url, data=payload, headers={
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        })
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data["choices"][0]["message"]["content"]

class OpenAIProvider(AIProvider):
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.url = "https://api.openai.com/v1/chat/completions"

    def generate_text(self, prompt: str) -> str:
        if not self.api_key:
            raise ValueError("OpenAI API key not configured")
        payload = json.dumps({
            "model": "gpt-4o-mini",
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.7
        }).encode("utf-8")
        req = urllib.request.Request(self.url, data=payload, headers={
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        })
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data["choices"][0]["message"]["content"]

def get_ai_provider() -> AIProvider | None:
    if Config.GROQ_API_KEY:
        return GroqProvider(Config.GROQ_API_KEY)
    elif Config.OPENAI_API_KEY:
        return OpenAIProvider(Config.OPENAI_API_KEY)
    return None
