# SirenChorus

> WebRTC based collaborative MermaidJS editor.

## Why?

I've recently found myself in multiple meetings editing diagram with multiple people as we work through a problem and felt the need for this as the [Mermaid Live Editor](https://mermaid.live/edit) doesn't support this. It's also a good opportunity to play with WebRTC and CRDTs.

Other options:

- There are multiple code based editor online but they don't support multiplayer so we're stuck watching one person write things down.
  E.g. [Mermaid's live editor](https://mermaid.live/edit#pako:eNpt0LFuAjEMBuBXMZ7DC9xAhcRQKnXqVmWxkv-4SElMQyKEEO9O7q5seLKc749k39mpBw98wV9DdjgEORVJNlOvfQwO293uS6c80CdiVJp7Q5NeSQropu3jnV2VkzwLmiCFEv7l_Lbtckn0b8OaNXRcAgvuqc1bfaQRiHQqkLphwwklSfB9g_vsLdcJCZaH3nqM0mK1bPOjU2lVf27Z8VBLg-F29lJfC7-G8KFq-V6PstzG8Fnyr2ono8QLHk-kw2Qy).
- We could use a VSCode remote session but that only works if everyone has it setup and the firewall plays nice.
- Many visual editors have multiplayer but I'd prefer editing in a text format for easy sharing, version tracking and inclusion in other tech docs later.
- We can also use a collaborative Markdown editor with mermaid support, e.g. [HackMD](https://hackmd.io/). This is honestly pretty close to what I want with very few rough edges.

## Architecture

> TODO

## Development

### Locally

- Install [bun](https://bun.sh). The version used is documented in [`.tool-versions`](./.tool-versions).
- Run `bun dev` and `bun run ws-server` in 2 separate shells.
- Head to `http://localhost:1234`

Other development tasks such `bun run lint` are available under `package.json:scripts`.

### GitHub actions

Linting and type-checking will run on pull requests against the `main` branch and pushed to `main`.

## Deployment

### Docker

There's no public live deployment yet but there is a Docker image available.

To build the docker image:

```shell
bun run build
docker build -t siren-chorus:latest .
```

### fly.io

Deploying against [fly.io](https://fly.io) is also possible by copying the [example config](./fly.example.toml) and creating a new app.

```shell
bun run build
fly launch
fly scale count 1
```

After the first launch you should be able to just do `fly deploy --ha=false`.

Disabling HA is required as the websocket server needs to have a single instance for now.
