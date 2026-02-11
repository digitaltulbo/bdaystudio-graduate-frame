FROM python:3.11-slim

WORKDIR /app

# Install cloudflared
RUN apt-get update && apt-get install -y --no-install-recommends curl && \
    curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o /usr/local/bin/cloudflared && \
    chmod +x /usr/local/bin/cloudflared && \
    apt-get purge -y curl && apt-get autoremove -y && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY grad_upload_receiver.py .
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

# Create upload directory
RUN mkdir -p /data/grad-uploads

EXPOSE 5050

ENTRYPOINT ["./entrypoint.sh"]
