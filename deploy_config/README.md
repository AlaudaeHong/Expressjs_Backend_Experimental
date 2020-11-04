# Deploy the Whole Project on a Real Server

## Under the water
* NodeJS and PM2
* Nginx
* Certbot (For certification)

## NodeJS and PM2
### Install NodeJS on AWS Lighttail/EC2
Follow the instruction on 
https://github.com/nodesource/distributions/blob/master/README.md
> Homepage:https://nodejs.org/en/

### Install PM2
npm install pm2 -g
> Homepage: https://pm2.keymetrics.io/

### Start/Stop the process
pm2 start/stop bin/www (or other root source file)

## Nginx and Certbot
### Install Nginx
apt-get install nginx
### Certbot Related Instruction
https://certbot.eff.org/lets-encrypt/ubuntufocal-nginx
### Configure Nginx
* Proxy API request to NodeJS Server
* Escape rest Request
* My Configuration (Cencored) can be founded
