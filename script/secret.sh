#!/usr/bin/env bash
# DEPLOY
# This script is for upload the .env to the instance

if [ $# != 1 ]; then
  echo "Usage: secret.sh IP"
else
  scp -i quickapi.pem .deploy.env ec2-user@$1:/home/ec2-user
  ssh -i quickapi.pem ec2-user@$1 "sudo mv /home/ec2-user/.deploy.env /var/app/current"
  ssh -i quickapi.pem ec2-user@$1 "sudo mv /var/app/current/.deploy.env /var/app/current/.env"
fi
