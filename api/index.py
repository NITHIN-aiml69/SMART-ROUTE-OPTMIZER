"""
Vercel Serverless Function Entry Point for Flask Backend
Exports the WSGI 'app' instance for Vercel Python runtime.
"""
import os
import sys

# Ensure root directory is on sys.path so app and engine packages are importable
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from app import app

# Vercel WSGI entry point
# 'app' is the Flask application instance
