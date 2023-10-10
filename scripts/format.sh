#!/bin/bash

# Navigate into ./package directory
cd package

# Run npm run format in the current directory
echo "Formatting in the current directory..."
npm run format:lint

# Navigate into ./demo directory
cd ../demo

# Run npm run format in ./demo directory
echo "Formatting in the ./demo directory..."
npm run format:lint