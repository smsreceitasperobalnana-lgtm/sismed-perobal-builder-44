
@echo off
chcp 65001 >nul
title SISMED Perobal v4.0 - Servidor
color 0B

echo.
echo ╔═══════════════════════════════════════════════╗
echo ║            SISMED PEROBAL v4.0               ║
echo ║        Sistema de Saúde Municipal            ║
echo ╠═══════════════════════════════════════════════╣
echo ║                                              ║
echo ║  🚀 Iniciando servidor local...              ║
echo ║                                              ║
echo ╚═══════════════════════════════════════════════╝
echo.

:: Verificar se Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js não encontrado!
    echo.
    echo 📥 Baixe e instale em: https://nodejs.org
    echo 💡 Escolha a versão LTS ^(recomendada^)
    echo.
    pause
    exit /b 1
)

:: Verificar se as dependências estão instaladas
if not exist "node_modules" (
    echo 📦 Instalando dependências...
    call npm install
    if errorlevel 1 (
        echo ❌ Erro ao instalar dependências!
        pause
        exit /b 1
    )
    echo ✅ Dependências instaladas com sucesso!
    echo.
)

:: Verificar se o build existe, se não, criar
if not exist "dist" (
    echo 🔨 Construindo aplicação...
    call npm run build
    if errorlevel 1 (
        echo ❌ Erro ao construir aplicação!
        pause
        exit /b 1
    )
    echo ✅ Aplicação construída com sucesso!
    echo.
)

:: Instalar express se não existir
if not exist "node_modules\express" (
    echo 📦 Instalando Express...
    call npm install express
)

:: Iniciar o servidor
echo 🌐 Iniciando servidor SISMED...
echo.
echo 💡 O sistema abrirá automaticamente no navegador
echo 💡 Pressione Ctrl+C para parar o servidor
echo.

:: Aguardar 2 segundos e abrir o navegador
timeout /t 2 /nobreak >nul
start http://localhost:3000

:: Iniciar o servidor Node.js
node server.js

pause
