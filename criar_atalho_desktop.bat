
@echo off
chcp 65001 >nul
title SISMED Perobal - Criar Atalho

echo.
echo ╔═══════════════════════════════════════════════╗
echo ║         SISMED PEROBAL v4.0                  ║
echo ║       Criador de Atalho na Área de Trabalho  ║
echo ╚═══════════════════════════════════════════════╝
echo.

set "desktop=%USERPROFILE%\Desktop"
set "currentDir=%~dp0"
set "shortcutName=SISMED Perobal v4.0.lnk"

echo 🔧 Criando atalho na área de trabalho...

:: Criar arquivo VBS temporário para criar o atalho
echo Set oWS = WScript.CreateObject("WScript.Shell") > "%temp%\CreateShortcut.vbs"
echo sLinkFile = "%desktop%\%shortcutName%" >> "%temp%\CreateShortcut.vbs"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%temp%\CreateShortcut.vbs"
echo oLink.TargetPath = "%currentDir%iniciar_sismed.bat" >> "%temp%\CreateShortcut.vbs"
echo oLink.WorkingDirectory = "%currentDir%" >> "%temp%\CreateShortcut.vbs"
echo oLink.Description = "SISMED Perobal v4.0 - Sistema de Saúde Municipal" >> "%temp%\CreateShortcut.vbs"
echo oLink.IconLocation = "%SystemRoot%\System32\shell32.dll,23" >> "%temp%\CreateShortcut.vbs"
echo oLink.Save >> "%temp%\CreateShortcut.vbs"

:: Executar o script VBS
cscript "%temp%\CreateShortcut.vbs" >nul

:: Limpar arquivo temporário
del "%temp%\CreateShortcut.vbs" >nul 2>&1

if exist "%desktop%\%shortcutName%" (
    echo ✅ Atalho criado com sucesso!
    echo.
    echo 📍 Localização: %desktop%\%shortcutName%
    echo.
    echo 💡 Agora você pode iniciar o SISMED clicando duplo no atalho da área de trabalho
) else (
    echo ❌ Erro ao criar atalho
)

echo.
pause
