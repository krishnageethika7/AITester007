import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

def verify_groq():
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": "Reply with: LINK OK"}],
            max_tokens=16
        )
        print(f"[OK] Groq connection successful.")
        print(f"     Model: llama-3.3-70b-versatile")
        print(f"     Response: {response.choices[0].message.content}")
        return True
    except Exception as e:
        print(f"[FAIL] Groq error: {e}")
        return False

if __name__ == "__main__":
    verify_groq()
