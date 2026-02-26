# NIER // TEXT_CHAT

Um chat minimalista e imersivo com estética Cyberpunk/NieR, integrado com webhooks do n8n.

## 🚀 Funcionalidades
- **Interface Imersiva:** Efeitos de scanlines, glitch e tipografia futurista.
- **Configuração Dinâmica:** Altere a URL do webhook diretamente na interface (salvo no localStorage).
- **Suporte Multimídia:** Recebe e exibe mensagens de texto e imagens (incluindo binários).
- **Responsivo:** Design adaptado para desktop e dispositivos móveis.

## 🛠️ Tecnologias
- React 19
- Vite
- Tailwind CSS
- Lucide React (Ícones)
- Motion (Animações)

## 📦 Como rodar o projeto localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/SEU_USUARIO/nier-chat.git
   cd nier-chat
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   O projeto estará disponível em `http://localhost:3000`.

## 🌐 Como subir para o GitHub

1. **Crie um novo repositório no GitHub** chamado `nier-chat`.
2. **No seu terminal, dentro da pasta do projeto:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/nier-chat.git
   git push -u origin main
   ```

## 🚀 Como fazer o Deploy no GitHub Pages

1. **No `package.json`, altere a linha `homepage`:**
   Substitua `GITHUB_USERNAME` pelo seu nome de usuário do GitHub.
   ```json
   "homepage": "https://seu-usuario.github.io/nier-chat",
   ```

2. **Execute o comando de deploy:**
   ```bash
   npm run deploy
   ```
   Isso irá compilar o projeto e subir a pasta `dist` para a branch `gh-pages` do seu repositório.

## 🔗 Configuração do Webhook (n8n)
O chat envia um POST no formato:
```json
{
  "message": "texto digitado"
}
```
E espera uma resposta JSON no formato:
```json
{
  "reply": "texto de resposta",
  "image": "url_da_imagem_opcional"
}
```
Ou uma resposta binária de imagem diretamente.
