# POC JavaScript Obfuscator

Este é um projeto de demonstração do uso do javascript-obfuscator para ofuscar código JavaScript.

## Instalação

```bash
npm install
```

## Uso

1. Coloque seu código JavaScript no arquivo `src/example.js`
2. Execute o script de ofuscação:
```bash
npm start
```
3. O código ofuscado será gerado em `dist/obfuscated.js`

## Configurações

As configurações de ofuscação podem ser ajustadas no arquivo `index.js`. As opções atuais incluem:

- Control Flow Flattening
- Dead Code Injection
- String Array Transformations
- Identifier Renaming
- E muito mais...

## Estrutura do Projeto

```
.
├── src/
│   └── example.js    # Código fonte original
├── dist/
│   └── obfuscated.js # Código ofuscado gerado
├── index.js          # Script de ofuscação
└── package.json      # Dependências do projeto
``` 