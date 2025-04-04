#require -Module ImportExcel

Import-Excel -Path '.\ÜbersichtGesucheUndInformationen.xlsx' |
    ConvertTo-Json | Set-Content -Path 'ÜbersichtGesucheUndInformationen.json' -Encoding 'UTF8'
