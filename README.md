#Node-Underscore-HTML-Generator
Pass in a json data object and the path to the Underscore template you want to populate. Returns a data object with
property 'html' which contains the populated template.

__Installation__

`npm install node-underscore-html-generator --save`

__Usage__

```javascript
var NodeUndrsc = require('node-underscore-html-generator');
// Then in your code where necessary

//@params {string} - filePath Path to the file containing the template
//@params {object} - json object Object containing the data to populate the template
var filePath = 'path/to/my/template.html';
var jsonObject = {
  "name": "Jackie",
  "email": "chan@funny.com"
};
NodeUndrsc.generateHtml(filePath, jsonObject, function (err, dataObject) {
  if (err) {
    // ... manage the error
    return;
  }
  /*
  dataObject = {
    html: "<html>...."
  }
   */
  var populatedHtml = dataObject.html;
  console.log(populatedHtml);
});

```

__Testing__

`npm test`