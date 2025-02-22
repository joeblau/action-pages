# Para + Cloudflare Pages

This is a simple action pages using Para, but it doens't work.

Development

set the env variable in `.env.local`

```sh
PARA_API_KEY_BETA=<beta-api-key>
```

### If you run, you will see the error below. which is due Sentry trying to use the file system.

```sh
bun run preview
```

Sentry error

```
▲  ./node_modules/module-details-from-path/index.js:3:1
▲  Module not found: Can't resolve 'path'
▲  1 | 'use strict'
▲  2 |
▲  > 3 | var path = require('path')
▲    | ^
▲  4 |
▲  5 | module.exports = function (file) {
▲  6 |   var segments = file.split(path.sep)
▲  
▲  https://nextjs.org/docs/messages/module-not-found
▲  
▲  Import trace for requested module:
▲  ./node_modules/import-in-the-middle/index.js
▲  ./node_modules/@sentry/node/build/esm/sdk/initOtel.js
▲  ./node_modules/@sentry/node/build/esm/index.js
▲  ./node_modules/@getpara/server-sdk/dist/esm/index.js
▲  ./src/app/api/send/route.ts
```

### If you run `bun run dev`, you will see the error below.

```sh
bun run dev
```

String Decoder error

```sh
  bun run dev                                                                                               ok | 2m 23s 
$ next dev --turbopack
   ▲ Next.js 15.1.6 (Turbopack)
   - Local:        http://localhost:3000
   - Network:      http://10.0.7.143:3000
   - Environments: .env.local

 ✓ Starting...
 ✓ Ready in 908ms
 ○ Compiling /api/send ...
 ✓ Compiled /api/send in 1742ms
 ⨯ [Error: The edge runtime does not support Node.js 'string_decoder' module.
Learn More: https://nextjs.org/docs/messages/node-module-in-edge-runtime]
 ⨯ [Error: The edge runtime does not support Node.js 'string_decoder' module.
Learn More: https://nextjs.org/docs/messages/node-module-in-edge-runtime]
 ✓ Compiled /_error in 442ms
 POST /api/send 500 in 2486ms
```

