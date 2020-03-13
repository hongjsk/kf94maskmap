'use strict'

var url = require('url'),
    querystring = require('querystring'),
    _http = require('http'),
    _https = require('https')

const BYPASS_SSL = true;

const baseRequestOptions = {
    pathname: 'https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1'
}

var cookieHeader = undefined

function requestMaskAPI(options) {

    var requestJSON = Object.assign({}, baseRequestOptions, options);
    if (options.pathname) {
        requestJSON.pathname = baseRequestOptions.pathname + options.pathname
    }
    var requestUrl = url.format(requestJSON)

    var requestHeaders = {};
    
    if (cookieHeader) {
        requestHeaders['Cookie'] = cookieHeader
    }

    var requestOptions = Object.assign({}, {
        method: 'GET',
        headers : requestHeaders
    }, url.parse(requestUrl));

    var http = _http

    if (requestOptions.protocol == 'https:') {
        http = _https;
        //requestOptions['ca'] = rootca;
        if (BYPASS_SSL) {
            requestOptions['rejectUnauthorized'] = false;
        }
    }

    return new Promise(function(resolve, reject){
        http.request(requestOptions, function(response){
            var serverData = '';
            response.on('data', function (chunk) {
                serverData += chunk;
            });
            response.on('end', function () {
                // console.log(serverData);
                resolve(serverData)
            });
    
            if (response.statusCode != 200) {
                console.error(response.statusMessage);
                reject(new Error(response.statusMessage));
            }
        }).on('error', function(e) {
            console.error(e);
            reject(e);
        }).end();
    });
}

function getMaskStoresByGeo(request, response) {
    const lat = request.query.lat
    const lng = request.query.lng
    const m = request.query.m || 500
    // console.log(`lat:${lat}, lng:${lng}, m:${m}`)
    requestMaskAPI({
        pathname: '/storesByGeo/json',
        query: request.query
    }).then(result => {
        response.setHeader('Content-Type', 'application/json');
        response.write(result);
        response.end();
    }).catch(err => {
        console.log(err)
    })
}

module.exports = require('express').Router()
  .get('/storesByGeo/json', getMaskStoresByGeo)