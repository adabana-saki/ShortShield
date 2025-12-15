# Resize icons to proper sizes for Firefox validation
Add-Type -AssemblyName System.Drawing

$sourceIcon = "public/icons/icon.png"
$sizes = @(16, 32, 48, 128)

if (-not (Test-Path $sourceIcon)) {
    Write-Error "Source icon not found: $sourceIcon"
    exit 1
}

Write-Host "Loading source icon..."
$source = [System.Drawing.Image]::FromFile((Resolve-Path $sourceIcon))
Write-Host "Source size: $($source.Width)x$($source.Height)"

foreach ($size in $sizes) {
    $outputPath = "public/icons/icon-$size.png"
    Write-Host "Creating $outputPath ($size x $size)..."

    $resized = New-Object System.Drawing.Bitmap($size, $size)
    $graphics = [System.Drawing.Graphics]::FromImage($resized)

    # High quality resize
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    $graphics.DrawImage($source, 0, 0, $size, $size)

    $resized.Save((Resolve-Path "public/icons" | Join-Path -ChildPath "icon-$size.png"), [System.Drawing.Imaging.ImageFormat]::Png)

    $graphics.Dispose()
    $resized.Dispose()

    Write-Host "Created $outputPath"
}

$source.Dispose()
Write-Host "Done!"
