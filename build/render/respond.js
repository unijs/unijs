'use strict';

var respond = function respond(req, res, next) {
   var render = req.unijs.app.render(req, res, next);
   var html = '\n   <html>\n      <head>\n      ' + render.head.join('') + '\n      </head>\n      <body>\n      ' + render.body.join('') + '\n      </body>\n   </html>\n   ';
   res.send(html);
};
module.exports = respond;