#!/usr/bin/env python3
"""Remove embedded PNG metadata by pixel-preserving re-encoding and audit."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import tempfile
from PIL import Image


def clean_image(source, audit_path):
    source = Path(source).resolve()
    audit_path = Path(audit_path).resolve()
    if source == audit_path:
        raise ValueError('Audit path must differ from image path')
    with Image.open(source) as image:
        if image.format != 'PNG' or getattr(image, 'n_frames', 1) != 1:
            raise ValueError('Convert to a single-frame RGB/RGBA PNG before cleanup')
        if image.mode not in ('RGB', 'RGBA'):
            raise ValueError('Convert to RGB/RGBA before cleanup; no implicit bit-depth conversion')
        image.load()
        if image.info.get('icc_profile'):
            raise ValueError('Convert the image to sRGB before removing its color profile')
        pixels, mode, size = image.tobytes(), image.mode, image.size
    fd, temporary = tempfile.mkstemp(suffix='.png', dir=source.parent)
    os.close(fd)
    try:
        Image.frombytes(mode, size, pixels).save(temporary, format='PNG')
        with Image.open(temporary) as cleaned:
            if cleaned.info or cleaned.tobytes() != pixels:
                raise ValueError('Cleanup failed metadata/pixel verification')
        os.replace(temporary, source)
    finally:
        if os.path.exists(temporary):
            os.unlink(temporary)
    attributes = []
    attribute_check = 'unavailable'
    if hasattr(os, 'listxattr'):
        try:
            attributes = os.listxattr(source)
            attribute_check = 'checked'
        except OSError:
            attribute_check = 'unavailable'
    report = {'file': source.name, 'sha256': hashlib.sha256(source.read_bytes()).hexdigest(),
              'embedded_metadata_empty': True, 'pixels_unchanged': True,
              'xattrs_remaining': attributes, 'xattr_check': attribute_check,
              'note': 'No synthetic camera fields added. Extended attributes are reported separately; not an AI-origin detection guarantee.'}
    audit_path.parent.mkdir(parents=True, exist_ok=True)
    audit_path.write_text(json.dumps(report, ensure_ascii=False, indent=2)+'\n')
    return report


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('image', type=Path)
    parser.add_argument('--audit', type=Path, required=True)
    args = parser.parse_args()
    print(json.dumps(clean_image(args.image, args.audit), ensure_ascii=False))
