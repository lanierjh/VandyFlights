#!/bin/bash

uvicorn server.app:app --reload --port 8001
cd client
npm run dev
