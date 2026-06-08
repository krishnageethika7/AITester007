import os
import shutil

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TMP_DIR = os.path.join(BASE_DIR, ".tmp")


def deliver_payload(issue_key: str, markdown_content: str) -> str:
    if not markdown_content.strip():
        raise ValueError("Cannot deliver an empty test plan.")

    os.makedirs(TMP_DIR, exist_ok=True)

    filename = f"test_plan_{issue_key}.md"
    tmp_path = os.path.join(TMP_DIR, filename)
    final_path = os.path.join(BASE_DIR, filename)

    with open(tmp_path, "w", encoding="utf-8") as f:
        f.write(markdown_content)

    shutil.copy2(tmp_path, final_path)

    print(f"[OK] Test plan saved: {final_path}")
    return final_path


if __name__ == "__main__":
    deliver_payload("SCRUM-5", "# Test Plan\n\nSample content.")
