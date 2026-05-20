$word = New-Object -ComObject Word.Application
$word.Visible = $false
$files = @(
    '01_PRD_Nomenclaturas_del_Valle.docx',
    '02_Arquitectura_Nomenclaturas_del_Valle.docx',
    '03_Sitemap_Nomenclaturas_del_Valle.docx',
    '04_DisenoUI_Nomenclaturas_del_Valle.docx',
    '05_BaseDatos_Nomenclaturas_del_Valle.docx'
)
foreach($f in $files) {
    $path = Join-Path 'C:\Users\artur\Documents\NomeValle' $f
    $doc = $word.Documents.Open($path)
    $txtPath = $path -replace '\.docx$','.txt'
    $doc.SaveAs([ref]$txtPath, [ref]2)
    $doc.Close()
    Write-Host "Converted: $f"
}
$word.Quit()
