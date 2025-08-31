
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Servir arquivos estáticos
app.use(express.static('dist'));
app.use(express.static('public'));

// Rota para a página de loading
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'loading.html'));
});

// Rota para o sistema principal
app.get('/sistema', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Rotas específicas do sistema - todas direcionam para o React app
const routes = ['/dashboard', '/pacientes', '/medicamentos', '/receitas', '/configuracoes', '/identificacao', '/atestados', '/comparecimentos'];

routes.forEach(route => {
    app.get(route, (req, res) => {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
});

// Fallback para todas as outras rotas
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════╗
║            SISMED PEROBAL v4.0               ║
║        Sistema de Saúde Municipal            ║
║                                              ║
║  🌐 Servidor executando em:                  ║
║     http://localhost:${PORT}                      ║
║                                              ║
║  📋 URLs disponíveis:                        ║
║     • Loading: http://localhost:${PORT}/          ║
║     • Sistema: http://localhost:${PORT}/sistema   ║
║     • Dashboard: http://localhost:${PORT}/dashboard ║
║     • Pacientes: http://localhost:${PORT}/pacientes ║
║                                              ║
║  ⚡ Pressione Ctrl+C para parar             ║
╚═══════════════════════════════════════════════╝
    `);
});
