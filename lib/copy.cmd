@echo off
chcp 65001
SET saveDirectry="%*"
net use %saveDirectry%

REM del /q /s %saveDirectry%
REM for /d %%1 in (%saveDirectry%\*) do rd /s /q "%%1" && mkdir %saveDirectry%

xcopy /e /I /D /Y "%CD%" %saveDirectry%

net use %saveDirectry% /delete /y

echo pause
exit
