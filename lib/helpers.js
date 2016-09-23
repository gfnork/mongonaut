'use strict';
exports.runQueryAction = function (mode, sources) {
  let promiseList = [];
  if (Array.isArray(sources)) {
    sources.forEach(function (source) {
      promiseList.push(mode.call(this, source));
    });
  }
  else {
    promiseList.push(mode.call(this, sources));
  }

  return Promise.all(promiseList);
};

exports.getDbQuery = function (mode) {
  return function (target) {
    return new Promise((resolve, reject) => {
      var mongoimport = this.spawn('mongoimport', this.query[mode].call(this, target).split(' ').splice(1).filter(function (str) {
        return /\S/.test(str);
      }));
      resolve(mongoimport);
    });
  }
};

exports.generateAuth = function (settings) {
  if (settings.user.length > 0 && settings.pwd.length > 0) {
    return `-u ${settings.user} -p ${settings.pwd} --authenticationDatabase ${settings.db}`;
  }
  else if (settings.user.length + settings.pwd.length > 0) {
    throw new Error('Missing user name or password');
  }
};
