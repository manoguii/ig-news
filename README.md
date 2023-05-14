<h1 align="center">
  📖 Ig-News
</h1>

<p align="center">
  <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/manoguii/ig-news?color=blue">
  <img alt="Repository size" src="https://img.shields.io/github/repo-size/manoguii/ig-news?color=blue">
  <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/manoguii/ig-news?color=blue">
</p>

<div align="left">
  <img src="public/ig-news.png" alt="faladev" >
</div>

## Instalação

- Primeiro você precisa criar uma conta nas plataformas na qual o projeto tem integração

- [x] [Stripe](https://stripe.com/br)
- [x] [GitHub](https://github.com)
- [x] [Prismic](https://prismic.io/)

- Clonar este repositório:
```sh
  $ git clone https://github.com/manoguii/ig-news.git
```

- Crie um arquivo ```.env.local``` na raiz do projeto e preencha as variáveis ambiente, o exemplo de como deve ficar esta em ```.env.local.example```

- Instale as dependências
```sh
$ pnpm install
```

- Crie o banco de dados local
```bash
$ docker run --name ig-news -e MYSQL_ROOT_PASSWORD=docker -p 3306:3306 mysql:latest
```

- Instalar a CLI do stripe para ouvir webhooks
  
- [x] [Stripe CLI](https://stripe.com/docs/stripe-cli)

- Faça login na CLI do stripe
```sh
  $ stripe login
```

- Execute o comando abaixo para ouvir os webhooks
```sh
  $ stripe listen --forward-to localhost:3000/api/webhooks
```

- Apos executar o comando acima, copie a chave gerada em ...
```bash
  $ "Ready! You are using Stripe API Version [2022-08-01]. Your webhook signing secret is ${CHAVE STRIPE}"
```

- Colar a chave Stripe em ```.env.local```
```bash
  $ STRIPE_WEBHOOK_SECRET="${CHAVE STRIPE}"
```

- Execute a aplicação
```bash
$ pnpm dev
```

## Sobre

O ig-news é uma plataforma de conteúdo de texto, permite aos usuários acessar o conteúdo dos posts com uma assinatura mensal, integrado com stripe para gerenciar pagamentos, prismic io para gerenciar conteúdo dos posts, github para fazer login no site e banco de dados fauna. 🚀

## Tecnologias 

Abaixo as tecnologias utilizadas para construção da aplicação

- [ReactJS](https://reactjs.org/)
- [NextJS](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Stripe](https://stripe.com/)
- [Prismic CMS](https://prismic.io/)

---

<p align="center">Made with 💙 by Guilherme David</p>