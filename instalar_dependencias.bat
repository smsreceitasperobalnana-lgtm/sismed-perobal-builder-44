
@echo off
chcp 65001 >nul
title SISMED Perobal v4.0 - Instalação
color 0E

echo.
echo ╔═══════════════════════════════════════════════╗
echo ║            SISMED PEROBAL v4.0               ║
echo ║        Instalador de Dependências            ║
echo ╠═══════════════════════════════════════════════╣
echo ║                                              ║
echo ║  📦 Configurando ambiente...                 ║
echo ║                                              ║
echo ╚═══════════════════════════════════════════════╝
echo.

:: Verificar se Node.js está instalado
echo 🔍 Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js não encontrado!
    echo.
    echo 📥 Para continuar, você precisa instalar o Node.js:
    echo    1. Acesse: https://nodejs.org
    echo    2. Baixe a versão LTS ^(recomendada^)
    echo    3. Execute o instalador
    echo    4. Reinicie o computador
    echo    5. Execute este arquivo novamente
    echo.
    echo 🌐 Abrindo página de download...
    start https://nodejs.org
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js encontrado!
node --version

:: Verificar npm
echo 🔍 Verificando npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm não encontrado!
    pause
    exit /b 1
)
echo ✅ npm encontrado!
npm --version

echo.
echo 📦 Instalando dependências do SISMED...
echo    Isso pode levar alguns minutos...
echo.

:: Instalar dependências principais
call npm install
if errorlevel 1 (
    echo.
    echo ❌ Erro na instalação das dependências principais!
    echo.
    echo 💡 Possíveis soluções:
    echo    1. Verifique sua conexão com internet
    echo    2. Execute como Administrador
    echo    3. Tente: npm cache clean --force
    echo.
    pause
    exit /b 1
)

:: Instalar Express para o servidor
echo 📦 Instalando Express...
call npm install express
if errorlevel 1 (
    echo ❌ Erro ao instalar Express!
    pause
    exit /b 1
)

:: Construir a aplicação
echo 🔨 Construindo aplicação...
call npm run build
if errorlevel 1 (
    echo ❌ Erro ao construir aplicação!
    pause
    exit /b 1
)

echo.
echo ✅ Instalação concluída com sucesso!
echo.
echo ╔═══════════════════════════════════════════════╗
echo ║                PRONTO PARA USO               ║
echo ╠═══════════════════════════════════════════════╣
echo ║                                              ║
echo ║  🚀 Para iniciar o sistema:                  ║
echo ║     Clique duplo em: iniciar_sismed.bat      ║
echo ║                                              ║
echo ║  🌐 Ou acesse: http://localhost:3000         ║
echo ║                                              ║
echo ╚═══════════════════════════════════════════════╝
echo.

pause
