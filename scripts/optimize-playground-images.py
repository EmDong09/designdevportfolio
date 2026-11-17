# Optional asset preparation: python3 -m pip install Pillow
# Run from the repository root: python3 scripts/optimize-playground-images.py
# Generated thumbnails are committed; npm build needs no Python dependency.
from pathlib import Path
import json
from PIL import Image,ImageOps
root=Path.cwd()
s=(root/'site/content.js').read_text()
items=json.loads(s.split('window.portfolioContent.playground.studies = ',1)[1].strip().removesuffix(';'))
before=after=0
for item in items:
    source=root/'site'/item['src'].lstrip('/')
    before+=source.stat().st_size
    image=ImageOps.exif_transpose(Image.open(source)).convert('RGB')
    for height,suffix in [(360,'-thumb'),(720,'-thumb-2x')]:
        resized=image.copy();resized.thumbnail((round(height*image.width/image.height),height))
        dest=source.with_name(source.stem+suffix+'.webp')
        resized.save(dest,'WEBP',quality=82,method=6)
        if height==360:after+=dest.stat().st_size
print(f'Gallery first-load images: {before:,} bytes full-size → {after:,} bytes thumbnails ({100*(1-after/before):.1f}% reduction).')
