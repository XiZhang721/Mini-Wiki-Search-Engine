#!/bin/bash
source /home/xubohan1107/miniconda3/envs/myenv/bin/activate
exec gunicorn -b :5000 main:app
