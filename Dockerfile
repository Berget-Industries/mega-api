FROM denoland/deno:1.38.5

WORKDIR /server

COPY . .

RUN ["deno", "test", "-r", "--allow-net", "--allow-env", "--allow-read", "--allow-sys"]

CMD ["deno", "run", "-r", "--allow-net", "--allow-env", "--allow-read", "--allow-sys", "src/index.ts"]