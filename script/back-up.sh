#!/usr/bin/env bash
# BACKUPS
# Is for make a back up of the database

if [ $# != 4 ]; then
  echo "Usage: back-up.sh PASSWORD DATABASE COLLECTION FILE"
else
  mongoexport --uri mongodb+srv://quick:$1@cluster0.lwjfu.mongodb.net/$2 --collection $3 --type json --out backups/$4
fi
