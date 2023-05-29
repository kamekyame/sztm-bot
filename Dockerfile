FROM denoland/deno:alpine-1.33.3

WORKDIR /home/sztm
COPY . .

RUN deno task cache

CMD deno task run