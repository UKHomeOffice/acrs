# Afghan Citizens Resettlement Scheme (ACRS )


## Install prerequisites

Step 1 : Install Node Version Manager

        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
        # or
        wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
        # or
        brew install nvm

        Check the version   nvm --version

Step 2 : nvm install 18.19.0

Step 3: nvm use 18.19.0

Step 4: npm i -g yarn

Step 5: touch .env
        then copy and paste the ACRS secrets into this file 
Step 6: yarn

Step 7: yarn run start:dev

- [Node.js](https://nodejs.org/en/) - Tested against LTS
- NPM (installed with Node.js) - Works with versions 2 and 3
- [Redis server](http://redis.io/download) running on the default port
