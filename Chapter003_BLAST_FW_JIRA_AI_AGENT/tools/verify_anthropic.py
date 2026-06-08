import os
import anthropic
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")

def verify_anthropic():
    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    try:
        message = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=16,
            messages=[{"role": "user", "content": "Reply with: LINK OK"}]
        )
        print(f"[OK] Anthropic connection successful.")
        print(f"     Response: {message.content[0].text}")
        return True
    except Exception as e:
        print(f"[FAIL] Anthropic error: {e}")
        return False

if __name__ == "__main__":
    verify_anthropic()
