# 🏭 MOC Studio BR

**Sistema de Gerenciamento de Mudanças (Management of Change)** para instalações industriais offshore e onshore no Brasil.

[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-Private-red?style=flat)](#)

## 📋 Sobre o Projeto

MOC Studio BR é uma plataforma web moderna desenvolvida para gerenciar processos de **Management of Change (MOC)** em ambientes industriais, focado nas necessidades específicas de operações offshore e onshore no Brasil. O sistema oferece controle completo sobre solicitações de mudança, análise de riscos, gestão de equipamentos e rastreabilidade completa através de audit trail.

### Principais Funcionalidades

- **Dashboard Interativo**: Visualização centralizada de indicadores-chave e métricas operacionais
- **Gestão de Unidades**: Controle de instalações industriais (FPSOs, plataformas, refinarias)
- **Gerenciamento de Equipamentos**: Cadastro e acompanhamento de ativos críticos
- **Requisições MOC**: Workflow completo para solicitações de mudança com aprovações
- **Análise de Risco**: Avaliação integrada de impactos em segurança e operações
- **Ordens de Serviço**: Gestão de trabalhos relacionados às mudanças aprovadas
- **Biblioteca de Normas**: Acesso rápido a padrões técnicos e regulatórios
- **Administração de Usuários**: Controle de acessos baseado em perfis e permissões
- **Audit Trail**: Rastreabilidade completa de ações e alterações no sistema
- **Modo Escuro**: Interface adaptável para diferentes ambientes de trabalho

### Perfis de Usuário

O sistema suporta múltiplos perfis com permissões específicas:

- **ADMIN**: Acesso completo ao sistema
- **GERENTE_INSTALACAO**: Gestão operacional de unidades
- **ENG_PROCESSO**: Análise técnica e aprovação de mudanças
- **COORD_HSE**: Avaliação de riscos de segurança e meio ambiente
- **COMITE_APROVACAO**: Aprovação final de MOCs críticos
- **TECNICO_MANUTENCAO**: Execução de ordens de serviço

## 🚀 Tecnologias

### Core

- **React 19.2.4**: Framework principal para construção da interface
- **TypeScript 5.8.2**: Tipagem estática para maior confiabilidade
- **Vite 6.2.0**: Build tool de alta performance
- **React Router DOM 7.13.0**: Roteamento SPA com navegação protegida

### UI & Visualização

- **Lucide React 0.563.0**: Biblioteca de ícones moderna e otimizada
- **Recharts 3.7.0**: Gráficos e dashboards interativos
- **Leaflet 1.9.4**: Mapas para visualização geográfica de instalações

### Integração & IA

- **Google GenAI 1.40.0**: Capacidades de IA generativa para análises preditivas

## 📦 Instalação

### Pré-requisitos

- Node.js (versão 18.x ou superior recomendada)
- npm ou yarn
- Git

### Passos de Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/celloweb-ai/MOC_Studio_BR.git
cd MOC_Studio_BR
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env.local` na raiz do projeto:
```env
VITE_API_BASE_URL=sua_url_api
VITE_GOOGLE_GENAI_KEY=sua_chave_api
```

4. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## 🛠️ Scripts Disponíveis

| Comando | Descrição |
|---------|----------|
| `npm run dev` | Inicia servidor de desenvolvimento com hot-reload |
| `npm run build` | Gera build de produção otimizado |
| `npm run preview` | Visualiza build de produção localmente |

## 📂 Estrutura do Projeto

```
MOC_Studio_BR/
├── pages/              # Componentes de páginas principais
│   ├── Dashboard.tsx
│   ├── Facilities.tsx
│   ├── Assets.tsx
│   ├── MOCRequests.tsx
│   ├── MOCDetails.tsx
│   ├── RiskAnalysis.tsx
│   ├── WorkOrders.tsx
│   ├── Standards.tsx
│   ├── UserAdmin.tsx
│   ├── AuditTrail.tsx
│   ├── Login.tsx
│   └── ForgotPassword.tsx
├── services/           # Serviços e integração com API
│   └── api.ts
├── App.tsx             # Componente raiz com roteamento
├── types.ts            # Definições TypeScript
├── constants.ts        # Constantes e configurações
├── index.tsx           # Entry point da aplicação
├── index.html          # Template HTML
├── vite.config.ts      # Configuração do Vite
├── tsconfig.json       # Configuração do TypeScript
└── package.json        # Dependências e scripts
```

## 🔐 Autenticação e Segurança

O sistema implementa autenticação robusta com os seguintes recursos:

- **JWT Token**: Autenticação baseada em tokens
- **Refresh Token**: Renovação automática de sessões
- **Validação de Sessão**: Verificação periódica a cada 30 segundos
- **Rotas Protegidas**: Controle de acesso baseado em perfil de usuário
- **Timeout de Sessão**: Logout automático por inatividade

## 🎨 Temas

A aplicação suporta dois temas visuais:

- **Tema Claro**: Otimizado para ambientes bem iluminados
- **Tema Escuro**: Reduz fadiga visual em operações prolongadas

A preferência é salva localmente e persistida entre sessões.

## 📱 Responsividade

A interface é totalmente responsiva e adaptável para:

- Desktop (1920x1080 e superiores)
- Laptops (1366x768 e superiores)
- Tablets (768px e superiores)
- Mobile (smartphones em modo retrato/paisagem)

## 🤝 Contribuindo

Este é um projeto privado. Para contribuições:

1. Entre em contato com os mantenedores
2. Receba acesso ao repositório
3. Crie uma branch para sua feature: `git checkout -b feature/MinhaFeature`
4. Commit suas mudanças: `git commit -m 'Adiciona MinhaFeature'`
5. Push para a branch: `git push origin feature/MinhaFeature`
6. Abra um Pull Request

## 📄 Licença

Este projeto é **privado** e proprietário. Todos os direitos reservados.

## 👥 Contato

**Desenvolvedor**: [celloweb-ai](https://github.com/celloweb-ai)

**Repositório**: [MOC_Studio_BR](https://github.com/celloweb-ai/MOC_Studio_BR/)

---

## 🔧 Troubleshooting

### Problemas Comuns

**Erro ao iniciar o servidor de desenvolvimento**
```bash
# Limpe o cache e reinstale dependências
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Build falhando**
```bash
# Verifique a versão do Node.js
node --version  # Deve ser 18.x ou superior

# Reconstrua o projeto
npm run build
```

**Erros de TypeScript**
```bash
# Verifique a configuração do tsconfig.json
# Certifique-se de que todos os tipos estão instalados
npm install --save-dev @types/node
```

## 📊 Performance

- **Build Size**: Otimizado com code-splitting e lazy loading
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.0s
- **Lighthouse Score**: 90+ (Performance, Accessibility, Best Practices)

---

**Desenvolvido com ❤️ para a indústria brasileira de Oil & Gas**