FROM denoland/deno:1.39.4

WORKDIR /server

COPY . .

CMD ["deno", "run", "-r", "--allow-net", "--allow-env", "--allow-read", "--allow-sys", "src/index.ts"]