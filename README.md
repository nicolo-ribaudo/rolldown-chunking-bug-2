# rolldown emits one more chunk than rollup for a wrapper entry + dynamic imports

Reported as [rolldown/rolldown#10731](https://github.com/rolldown/rolldown/issues/10731).

Given the same input and options, rolldown 1.2.5 emits `leaf.js` as a separate *common* chunk that the entry
chunk statically imports, while rollup 4.62.4 inlines it into the entry chunk (it is loaded by `entry.js` before
any `import()` can run, so no dynamic chunk ever needs it separately).

```sh
pnpm install
node repro.mjs          # rolldown 1.2.5 vs rollup 4.62.4, same input & options
node repro.mjs vite     # same, with preserveEntrySignatures: false (what Vite's client build passes)
node passes.mjs         # toggles the two rolldown chunk-optimization passes involved
```

## Try it online

- [Rolldown REPL (1.2.5)](https://repl.rolldown.rs/#eNqFk02P0zAQhv/KaC5pJeNoU3HJwt5AHBaEAHHBSDXJZOOtY1exQ4mq/HeUD2fbKtHeMu98vI/j8RkLTM9Ixtctf3b9t8H0JWaYYYpxDN+99CqDIQG+lB6s0S2canl0sK+kMnt4A1odCH4qT5GDTz8+P071lc0bTQxOpcrKqeedy2p19ODbI70XOJYIBFdnfSiV4c9O4AMXRlVHW3uIeDzJ0b0wyJAw9XVDHQvlAT+EI31mjbOauLZPm6hPRdv7y6GulDXl09hR3kQ8zltz14vbWzVZVHdBxY7hPDIQvQgLTGPyhkqTLMJRO4ZTGOaFcGFan5pBpkOEthAutPWpG4T5b0McQ94aWV1vgBt2QmrdwtgUNmH2Tq69k3XvZP1SVtxny7F0D38aD8b6W4bdNcNunWG3dgWvEfSFF/4T0EhQW61zezI8s6ZQTxcwC5mRi/4NBDkVstEezsIAKHNsfDpZ8oq85IPEejZfEhRKk4NK1gfKQbqJU5kh+e3D10fYhFe97Qfaxg8Tz2J87R+Vpi+yIicwFfjLyIp+Dy+QCczKxhxWCzomTDfsW8fwL6Z4xxP+Frv/9VVzjg==)
- [Rollup REPL (4.62.4)](https://rollupjs.org/repl/?version=4.62.4&shareable=eyJleGFtcGxlIjpudWxsLCJtb2R1bGVzIjpbeyJjb2RlIjoiLy8gU3RhdGljIGVudHJ5IHRoYXQgb25seSB3cmFwcyBgbWFpbmAgLSBsaWtlIFZpdGUncyBIVE1MIGVudHJ5IG1vZHVsZSwgd2hpY2ggd3JhcHMgPHNjcmlwdCB0eXBlPVwibW9kdWxlXCIgc3JjPVwibWFpbi5qc1wiPi5cbmltcG9ydCAnLi9tYWluLmpzJztcbiIsImlzRW50cnkiOnRydWUsIm5hbWUiOiJlbnRyeS5qcyJ9LHsiY29kZSI6ImNvbnNvbGUubG9nKCdtYWluJyk7XG5pbXBvcnQgJy4vc2hhcmVkLmpzJztcbmltcG9ydCgnLi9keW4xLmpzJyk7XG5pbXBvcnQoJy4vZHluMi5qcycpO1xuaW1wb3J0KCcuL2R5bjMuanMnKTtcbiIsImlzRW50cnkiOmZhbHNlLCJuYW1lIjoibWFpbi5qcyJ9LHsiY29kZSI6ImNvbnNvbGUubG9nKCdzaGFyZWQnKTtcbmltcG9ydCAnLi9sZWFmLmpzJztcbiIsImlzRW50cnkiOmZhbHNlLCJuYW1lIjoic2hhcmVkLmpzIn0seyJjb2RlIjoiY29uc29sZS5sb2coJ2xlYWYnKTtcbiIsImlzRW50cnkiOmZhbHNlLCJuYW1lIjoibGVhZi5qcyJ9LHsiY29kZSI6ImNvbnNvbGUubG9nKCdkeW4xJyk7XG5pbXBvcnQgJy4vbWFpbi5qcyc7IC8vIGR5bmFtaWMgZW50cnkgdGhhdCBzdGF0aWNhbGx5IGltcG9ydHMgYG1haW5gXG4iLCJpc0VudHJ5IjpmYWxzZSwibmFtZSI6ImR5bjEuanMifSx7ImNvZGUiOiJjb25zb2xlLmxvZygnZHluMicpO1xuaW1wb3J0ICcuL3NoYXJlZC5qcyc7IC8vIGR5bmFtaWMgZW50cnkgdGhhdCBpbXBvcnRzIGBzaGFyZWRgIGJ1dCBub3QgYG1haW5gXG4iLCJpc0VudHJ5IjpmYWxzZSwibmFtZSI6ImR5bjIuanMifSx7ImNvZGUiOiJjb25zb2xlLmxvZygnZHluMycpO1xuaW1wb3J0ICcuL2xlYWYuanMnOyAvLyBkeW5hbWljIGVudHJ5IHRoYXQgaW1wb3J0cyBgbGVhZmAgYnV0IG5vdCBgc2hhcmVkYFxuIiwiaXNFbnRyeSI6ZmFsc2UsIm5hbWUiOiJkeW4zLmpzIn1dLCJvcHRpb25zIjp7Im91dHB1dCI6eyJmb3JtYXQiOiJlcyIsImVudHJ5RmlsZU5hbWVzIjoiW25hbWVdLmpzIiwiY2h1bmtGaWxlTmFtZXMiOiJbbmFtZV0uanMifX19)

Both links open this exact `src/` (the Rolldown one also carries a `rolldown.config.js` that only sets `[name].js`
file names so the output is readable).

## Module graph (`src/`, 7 modules)

```
entry.js  ──►  main.js  ──►  shared.js  ──►  leaf.js      (static chain; entry.js only wraps main.js)
               main ··► dyn1 ──► main                      (dynamic entry importing chain level 1)
               main ··► dyn2 ──► shared                    (dynamic entry importing chain level 2)
               main ··► dyn3 ──► leaf                      (dynamic entry importing chain level 3)
```

(`──►` static import, `··►` dynamic import; every module has a `console.log` so nothing is tree-shaken.)

```
rolldown 1.2.5:
  dyn1.js    dynamic-entry  imports=[entry.js] modules=[dyn1]
  dyn2.js    dynamic-entry  imports=[entry.js] modules=[dyn2]
  dyn3.js    dynamic-entry  imports=[leaf.js]  modules=[dyn3]
  entry.js   entry          imports=[leaf.js]  modules=[shared, main, entry]
  leaf.js    COMMON         imports=[]         modules=[leaf]
rollup 4.62.4:
  dyn1.js    dynamic-entry  imports=[entry.js] modules=[dyn1]
  dyn2.js    dynamic-entry  imports=[entry.js] modules=[dyn2]
  dyn3.js    dynamic-entry  imports=[entry.js] modules=[dyn3]
  entry.js   entry          imports=[]         modules=[leaf, shared, main, entry]
```

Every piece is needed: the wrapper entry (`main.js` as the entry directly → rolldown matches rollup), the
static chain, `dyn1 → main` (so `main` gets a different bitset than `entry`), `dyn2 → shared` and `dyn3 → leaf`
(so `shared` and `leaf` each get their own bitset). Dropping any one of them makes rolldown's output equal rollup's.
`preserveEntrySignatures` makes no difference.

### Background

Found as a Vite 8.2.1 (rolldown) vs Vite 7.1.12 (rollup) difference: Vite turns an HTML entry into a wrapper
module (`import polyfill; import "/src/main.js"`), which is exactly the `entry.js → main.js` shape above, so any
Vite app whose lazily-loaded modules import the main script and some of its dependencies hits this. Vite feeds
rolldown the same graph it feeds rollup and sets no chunking-related option; the difference is entirely in
rolldown's chunk assignment.
