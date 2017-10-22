#!/usr/bin/env node

const AWS = require('aws-sdk');
const queue = require('d3-queue').queue;
const exec = (cmd, callback) => {
  require('child_process').exec(cmd, (err, stdout, stderr) => {
    err = stderr ? new Error(stderr) : err;
    callback(err, stdout);
  });
};

exec('git rev-parse HEAD', (err, gitsha) => {
  if (err) return console.log(`[${new Date()}] ✘ ${err.message}`);
  gitsha = gitsha.trim();
  exec('basename $(pwd)', (err, repo) => {
    if (err) return console.log(`[${new Date()}] ✘ ${err.message}`);
    repo = repo.trim();
    const q = queue(3);
    ['us-east-1', 'us-west-2', 'eu-west-1'].forEach(r => {
      q.defer(check, r, gitsha, repo);
    });

    q.awaitAll((err, res) => {
      if (err) return console.log(`[${new Date()}] ✘ ${err.message}`);
      return console.log(`[${new Date()}] ✔ Images for ${gitsha} found in all specified regions`);
    });
  });
});

const check = (region, gitsha, repo, callback) => {
  const ecr = new AWS.ECR({ region: region });
  ecr.batchGetImage({
    imageIds: [{ imageTag: gitsha }],
    repositoryName: repo
  }, function(err, data) {
    if (err) return callback(err);
    if (data && data.images.length) return callback(null, true);
    callback(new Error(`Images not found for commit ${gitsha} in all specified regions`));
  });
}
