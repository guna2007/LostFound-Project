#!/bin/bash
cd "$(dirname "$0")"
echo "Installing correct dependencies..."
npm install
echo "Starting dev server..."
npm run dev
