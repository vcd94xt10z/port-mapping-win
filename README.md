# port-mapping-win

Faz mapeamento de portas entre ips diferentes para Windows

Caso queira converter em um executável, instale o pkg

```
npm install -g pkg
```

Depois execute "pkg" no diretório onde se encontra o arquivo principal

```
pkg port-mapping.js
```

Comandos úteis

```sh
# exibe todas as regras
netsh interface portproxy show all

# limpa todas as regras
netsh interface portproxy reset
```
