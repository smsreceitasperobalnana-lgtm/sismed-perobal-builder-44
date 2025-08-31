
# 🚀 Como Executar o SISMED Perobal v4.0

## Pré-requisitos

### 1. Instalar Node.js
- Baixe e instale o Node.js em: https://nodejs.org
- Escolha a versão LTS (recomendada)
- Reinicie o computador após a instalação

## Instalação Rápida

### Opção 1: Instalação Automática (Recomendada)
1. **Execute**: Clique duplo no arquivo `instalar_dependencias.bat`
2. **Aguarde**: A instalação das dependências
3. **Pronto!** O sistema está configurado

### Opção 2: Criar Atalho na Área de Trabalho
1. **Execute**: Clique duplo no arquivo `criar_atalho_desktop.bat`
2. **Atalho criado**: Aparecerá na sua área de trabalho
3. **Use o atalho**: Para iniciar o sistema rapidamente

## Executar o Sistema

### Método 1: Atalho da Área de Trabalho
- **Clique duplo** no atalho "SISMED Perobal v4.0"
- O terminal será aberto automaticamente
- O navegador abrirá em http://localhost:3000

### Método 2: Arquivo BAT
- **Clique duplo** no arquivo `iniciar_sismed.bat`
- O sistema iniciará automaticamente

### Método 3: Manual
1. Abra o terminal na pasta do projeto
2. Execute: `npm run build` (primeira vez)
3. Execute: `node server.js`
4. Acesse: http://localhost:3000

## Fluxo do Sistema

1. **Loading Screen**: Tela de carregamento profissional (5 segundos)
2. **Redirecionamento**: Automático para o sistema principal
3. **Interface**: Sistema completo do SISMED

## URLs Disponíveis

| Página | URL |
|--------|-----|
| **Loading** | http://localhost:3000 |
| **Sistema** | http://localhost:3000/sistema |
| **Dashboard** | http://localhost:3000/dashboard |
| **Pacientes** | http://localhost:3000/pacientes |
| **Medicamentos** | http://localhost:3000/medicamentos |
| **Receitas** | http://localhost:3000/receitas |
| **Configurações** | http://localhost:3000/configuracoes |

## Parar o Sistema

- **No terminal**: Pressione `Ctrl + C`
- **Fechando janela**: Simplesmente feche o terminal

## Funcionalidades

✅ **Tela de Loading Profissional**: Com animações e progresso  
✅ **Servidor Local**: Roda em http://localhost:3000  
✅ **Auto-abertura**: Navegador abre automaticamente  
✅ **Atalho Desktop**: Criação automática de atalho  
✅ **Instalação Simples**: Apenas alguns cliques  
✅ **Interface Moderna**: Design profissional  

## Solução de Problemas

### ❌ "Node.js não encontrado"
- Instale o Node.js: https://nodejs.org
- Reinicie o computador
- Execute novamente

### ❌ "Erro ao instalar dependências"
- Verifique conexão com internet
- Execute como Administrador
- Tente: `npm cache clean --force` e depois `npm install`

### ❌ "Porta 3000 já em uso"
- Feche outros servidores na porta 3000
- Ou altere a porta no arquivo `server.js`

### ❌ "Navegador não abre"
- Abra manualmente: http://localhost:3000
- Verifique se há bloqueadores de popup

## Estrutura de Arquivos

```
SISMED-Perobal/
├── server.js                    # Servidor Express
├── loading.html                 # Tela de carregamento
├── dist/                        # Build da aplicação React
├── iniciar_sismed.bat          # Inicializar sistema
├── instalar_dependencias.bat   # Instalar dependências
├── criar_atalho_desktop.bat    # Criar atalho
└── src/                        # Código fonte React
```

---

**SISMED Perobal v4.0**  
*Sistema de Gestão de Receitas Médicas*  
*Prefeitura Municipal de Perobal*
