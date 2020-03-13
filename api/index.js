'use strict';

module.exports = (app) => {
  app.use('/corona19-masks/v1', require('./corona19-masks-v1'))
}
