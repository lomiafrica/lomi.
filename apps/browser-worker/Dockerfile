FROM mcr.microsoft.com/playwright:v1.62.1-noble
WORKDIR /app
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
COPY package.json ./
RUN npm install --omit=dev --ignore-scripts \
    && mkdir -p /data \
    && chown -R pwuser:pwuser /data /app
COPY --chown=pwuser:pwuser src ./src
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENV NODE_ENV=production \
    WORKER_DATA_DIR=/data \
    WORKER_HOST=0.0.0.0
EXPOSE 8790
ENTRYPOINT ["/entrypoint.sh"]
