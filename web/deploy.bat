@echo off
echo Deploying to Vercel Production...
cd /d "%~dp0"
vercel --prod --yes --force
pause
