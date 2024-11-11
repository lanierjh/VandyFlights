#!/bin/bash

uvicorn server.app:app --reload --port 8001
npm run dev
