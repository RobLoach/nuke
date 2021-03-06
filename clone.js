#!/usr/bin/env node
/*
 * Clone all repos under the jstransformer organization
 * Copyright © 2015 Tiancheng “Timothy” Gu
 * MIT-licensed
 */

var repos   = require('./repos')
  , config  = require('./read-config')
  , exec    = require('child_process').exec
  , readdir = require('fs').readdirSync
  , async   = require('async')
  , assert  = require('assert')
  , argv    = require('commander')
                .description('Clone all repos under the jstransformer '
                           + 'organization.')
                .option('-r, --root <dir>', 'directory to host all Git repos')
                .option('-j, --max-jobs <n>'
                      , 'maximum number of cloning process running '
                      + 'simultaneously', parseInt)
                .parse(process.argv)

var p = require('path').join.bind(this, argv.root || config.root || '')

repos(function (err, obj) {
  if (err) {
    console.log(err.stack)
    process.exit(1)
  }

  var each = argv.maxJobs ? async.eachLimit.bind(this, obj, argv.maxJobs)
                          : async.each.bind(this, obj)
    , errored = []
    , TOTAL = obj.length
    , c = 1

  each(function (repo, cb) {
    var name = repo.name
    try {
      if (!readdir(p(name)).length) throw new Error('now, clone it.')
      var tail = '\t' + name + '\t(' + (c++) + '/' + TOTAL + ')'
      console.log('Skipping:' + tail)
      return cb()
    } catch (ignored) {}

    console.log('Cloning:\t' + name)
    exec('git clone ' + repo.ssh_url + ' ' + p(name), function (err) {
      var tail = '\t' + name + '\t(' + (c++) + '/' + TOTAL + ')'
      if (err) {
        console.log('Errored:' + tail)
        errored.push({ name: name, err: err.message })
      } else {
        console.log('Done:\t' + tail)
      }
      cb()
    })
  }, function () {
    if (errored.length) {
      console.log('Cloning failed:')
      errored.forEach(function (repo) {
        console.log('\t' + repo.name + '\t' + repo.err)
      })
    } else console.log('All finished')
  })
})
