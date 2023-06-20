# Ig-News

<img
  alt='Imagem do projeto'
  src='public/ig-news.png'
/>

## Sobre

O ig-news é uma plataforma de conteúdo de texto, permite aos usuários acessar o conteúdo dos posts com uma assinatura mensal, integrado com stripe para gerenciar pagamentos, prismic io para gerenciar conteúdo dos posts, github para fazer login no site e banco de dados fauna. 🚀

## Instalação

```sh
  git clone https://github.com/manoguii/ig-news.git
```

- Para rodar o projeto localmente
  1. Primeiro você precisa criar uma conta nas plataformas na qual o projeto tem integração, o projeto usa o [Stripe](https://stripe.com/br) para gerenciar os pagamentos, [GitHub](https://github.com) para a parte de autenticação e [Prismic](https://prismic.io/) para criar o conteúdo dos posts.
  2. Crie um arquivo ```.env.local``` na raiz do projeto e preencha as variáveis ambiente, o exemplo de como deve ficar esta em ```.env.example```
  3. Instale as dependências ```pnpm install```
  4. Crie o banco de dados local ```docker run --name ig-news -e MYSQL_ROOT_PASSWORD=docker -p 3306:3306 mysql:latest```
  5. Execute a aplicação. ```pnpm dev```
  6. Acesse `http://localhost:3000`

O projeto usa a funcionalidade de webhooks do stripe para ouvir eventos como cancelamento de assinatura, pagamento da assinatura recusado e tratar esses casos de diferentes formas, caso queira testar você precisa instalar a [Stripe CLI](https://stripe.com/docs/stripe-cli) para o app conseguir ouvir os eventos localmente.

- Passo a passo da instalação.
  1. Faça login na CLI do stripe ```stripe login```
  2. Execute esse comando para ouvir os webhooks ```stripe listen --forward-to localhost:3000/api/webhooks```
  3. Apos executar o comando acima, copie a chave gerada na linha ```"Ready! You are using Stripe API Version [2022-08-01]. Your webhook signing secret is ${CHAVE STRIPE}"``` e cole a chave do stripe em ```.env.local``` na variável ```STRIPE_WEBHOOK_SECRET="${CHAVE STRIPE}"```
  
---

## Tecnologias

Algumas tecnologias utilizadas para construção da aplicação.

- [ReactJS](https://reactjs.org/)
- [NextJS](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Stripe](https://stripe.com/)
- [Prismic CMS](https://prismic.io/)

---

<center>Made with 💙 by Guilherme David</center>
