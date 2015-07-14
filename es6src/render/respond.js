var respond = function(req, res, next) {
   var render = req.unijs.app.render(req, res, next);
   var html = `
   <html>
      <head>
      ${render.head.join('')}
      </head>
      <body>
      ${render.body.join('')}
      </body>
   </html>
   `;
	res.send(html);
}
module.exports = respond;
