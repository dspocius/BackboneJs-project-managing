Frontend - returns html to user. It contains all the projects mini and communicates with API.
ImageMagick - for PDF converter
https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04
sudo npm install -g pm2
pm2 start hello.js

pm2 startup systemd

Fix issue with https:

Had the same issue, my app is behind nginx. Making these changes to my Nginx config removed the error.

location / {
proxy_pass http://127.0.0.1:8080;
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
proxy_set_header Host $host;
}

This is originally from https://chrislea.com/2013/02/23/proxying-websockets-with-nginx/

127.0.0.1 - vietoj localhost naudoti


Keliant i Android ar mobilia versija:

1. PATH - keičiasi keliai iki failų (RequireJS savo javascriptus gerai suhandlina).
Bet stiliaus ir paveiksliukų keičiasi - todėl nuimti "/pradzia.jpg" slashus ir rašyti "pradzia.jpg".
2. bmw.jpg - kaip pagrindinį paveiksliuką įkėliau prie stylesheet/project....css (dėl path).
3. Socket.io - waymanage.com/socket.io/socket.io.js - atsisiunčiau ir įdėjau į 
javascript/socket.io.js - tada main.js ir build.js panaudojau.
ir vietoj "io.connect" - "socket.connect" - nes pagal build panaudojau vardą socket vietoj io.
4. Dar sudo apt-get install fontconfig UBUNTU paciame
