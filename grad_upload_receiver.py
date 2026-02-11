import os
import json
import base64
from datetime import datetime
from pathlib import Path
from flask import Flask, request, jsonify

app = Flask(__name__)

UPLOAD_DIR = Path("/data/grad-uploads")
LOG_FILE = UPLOAD_DIR / "upload_log.jsonl"
API_KEY = os.environ.get("API_KEY", "")


def verify_auth(req):
    """Verify Bearer token authorization."""
    auth = req.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        return False
    return auth[7:] == API_KEY


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/api/grad-upload", methods=["POST"])
def grad_upload():
    # Auth check
    if not verify_auth(request):
        return jsonify({"error": "Unauthorized"}), 401

    try:
        data = request.get_json(force=True)
    except Exception:
        return jsonify({"error": "Invalid JSON"}), 400

    image_b64 = data.get("imageBase64", "")
    ip = data.get("ip", "unknown")
    file_size = data.get("fileSize", 0)
    sha256_hash = data.get("sha256Hash", "unknown")
    options = data.get("options", {})
    ts = data.get("timestamp", datetime.now().isoformat())

    # Build filename: YYMMDD/YYMMDD_HHMMSS_hash8.jpg
    now = datetime.now()
    date_dir = now.strftime("%y%m%d")
    time_part = now.strftime("%y%m%d_%H%M%S")
    hash_prefix = sha256_hash[:8] if sha256_hash else "00000000"
    filename = f"{time_part}_{hash_prefix}.jpg"
    relative_path = f"{date_dir}/{filename}"

    save_dir = UPLOAD_DIR / date_dir
    save_dir.mkdir(parents=True, exist_ok=True)
    save_path = save_dir / filename

    save_success = False

    # Save image
    try:
        if image_b64:
            # Strip data URI prefix if present
            if "," in image_b64:
                image_b64 = image_b64.split(",", 1)[1]
            image_bytes = base64.b64decode(image_b64)
            save_path.write_bytes(image_bytes)
            save_success = True
    except Exception as e:
        app.logger.error(f"Image save failed: {e}")

    # Always log, even if image save failed
    log_entry = {
        "timestamp": ts,
        "ip": ip,
        "hash": sha256_hash,
        "file_size": file_size,
        "options": options,
        "filename": relative_path,
        "success": save_success,
    }

    try:
        with open(LOG_FILE, "a", encoding="utf-8") as f:
            f.write(json.dumps(log_entry, ensure_ascii=False) + "\n")
    except Exception as e:
        app.logger.error(f"Log write failed: {e}")

    return jsonify({"status": "ok", "filename": relative_path})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050, debug=True)
