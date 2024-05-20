FROM denoland/deno:1.39.4

WORKDIR /server

COPY . .

ARG MEGA_ENV

ENV MEGA_ENV=$MEGA_ENV

CMD ["deno", "run", "-r", "--allow-net", "--allow-env", "--allow-read", "--allow-sys", "src/index.ts"]