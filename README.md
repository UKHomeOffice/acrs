# Afghan Citizens Resettlement Scheme (ACRS )


## Install prerequisites

### Database setup and integration
If this is a first-time install get postgres running on the default port and setup a new, empty local database called `acrs`.  
Run [hof-rds-api](https://github.com/UKHomeOffice/hof-rds-api) locally for the acrs service. Hof-rds-api is an api that will read and write to your local database.  
Follow the instructions in the [hof-rds-api README](https://github.com/UKHomeOffice/hof-rds-api/blob/master/README.md) to setup the correct configuration for your local `acrs` database and run the api in relation to acrs.

### Project setup and Run ACRS
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

Then visit: [http://localhost:8080/](http://localhost:8080/) For the start page and applicant journey


## Skip email verify step

You can skip the email authentication locally or in some of the testing environments.  You'll need to make sure you have an environment variable `allowSkip=true`. You'll also need an email as part of save and return.  You have 3 options either: using a `skipEmail` environment variable; using a key value paramenter in the url; or both.

1. To use an email environment variable, you'll need to set it like so `skipEmail=sas-hof-test@digital.homeoffice.gov.uk`. You can then go to the following url.

    http://localhost:8080/acrs/start?token=skip

2. Set the email in the url to whatever email you like.

    http://localhost:8080/acrs/start?token=skip&email=sas-hof-test@digital.homeoffice.gov.uk

3. If you do both, then the app will always use what you've set in the url parameter as the email.


## Testing

```bash
$ yarn run test
```
will run all tests.

### Linting Tests

```bash
$ yarn run test:lint
```

### Unit Tests

```bash
$ yarn test:unit
```
