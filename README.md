# case-cell-shop-web

# 🛒 CaseCellShop - Web (Front-end)

Interface da loja virtual desenvolvida em React + TypeScript, focada em uma experiência de compra fluida e responsiva.

## 🚀 Tecnologias

- **React + Vite:** Para um ambiente de desenvolvimento rápido e _build_ otimizado.
- **TypeScript:** Garantindo a tipagem de todos os dados da API.
- **Tailwind CSS (v4):** Estilização ágil e moderna.
- **Framer Motion:** Responsável pelas micro-interações e animações de interface (UX).
- **Axios:** Para consumo da API REST.
- **Sonner:** Para notificações (toasts) elegantes de feedback ao usuário.

## 🏗️ Estrutura do Projeto

- `src/components/`: Componentes modulares e reutilizáveis.
- `src/services/`: Configuração e instâncias do Axios para comunicação com o back-end.
- `src/types/`: Interfaces compartilhadas entre os componentes.

## 💻 Como Executar

**Pré-requisitos:** Node.js (v18+) instalado. Certifique-se de que o servidor back-end (`/server`) já esteja rodando na porta `3333`.

1. Instale as dependências:

```bash
  npm install
```

2. Inicie o servidor de desenvolvimento:

```bash
 npm run dev
```

3. Acesse a aplicação no navegador pelo endereço indicado no terminal (geralmente http://localhost:5173).

## 🎨 Decisões de UI/UX

[-] Mobile First: Todo o sistema foi desenhado para funcionar perfeitamente em telas pequenas, com grid responsivo.

[-] Feedback de Estado: Adicionamos estados de loading nos botões para evitar cliques duplicados e garantir que o usuário saiba que a compra está sendo processada.

[-] Tratamento de Erros: A interface é capaz de reagir a diferentes códigos de erro da API (409, 503, etc.), exibindo notificações visuais amigáveis conforme solicitado no desafio.
