#!/bin/bash

# This script sets up the environment property for 
# Mongo DB loopback connector. This property is used
# by REST server for connecting with the MongoDB 
# instance in the cloud | local

export COMPOSER_MULTIUSER=true

export COMPOSER_DATASOURCES='{
    "db": {
        "name": "db",
        
        "host": "localhost",
        "port": 27017,
       
        "database": "admin",

        "user": "admin",
        "password": "admin123",

        "connector": "mongodb"  
    }
}'

./rs-auth-github.sh
