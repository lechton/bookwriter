#!/usr/bin/env python3
import os
import subprocess

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PDF_DIR = os.path.join(BASE_DIR, 'md-lectures-pdf')

cover_pdf = os.path.join(BASE_DIR, '00_COVER.pdf')
toc_pdf = os.path.join(BASE_DIR, '00_TOC.pdf')
deck_pdf = os.path.join(PDF_DIR, 'Accessibility Q01-Q54.pdf')

output_root = os.path.join(BASE_DIR, 'Web Accessibility & Web Performance.pdf')
output_pdf_dir = os.path.join(PDF_DIR, 'Web Accessibility & Web Performance.pdf')

# Check inputs
for p in [cover_pdf, toc_pdf, deck_pdf]:
    if not os.path.exists(p):
        raise FileNotFoundError(f'Missing required file: {p}')

# Unite exactly: 1 Cover + 1 TOC + 1 Deck of lectures
cmd = ['pdfunite', cover_pdf, toc_pdf, deck_pdf, output_root]
print(f'Running: {" ".join(cmd)}')
res = subprocess.run(cmd, capture_output=True, text=True)
if res.returncode == 0:
    print(f'Successfully created: {output_root}')
    # Synchronize to md-lectures-pdf/ WITHOUT touching Accessibility Q01-Q54.pdf!
    subprocess.run(['cp', output_root, output_pdf_dir])
    print(f'Synchronized to: {output_pdf_dir}')
else:
    print(f'Error ({res.returncode}): {res.stderr}')
