/**
 * Created by mario (https://github.com/hyprstack) on 13/07/2016.
 */
/**
 * Created by mario (https://github.com/hyprstack) on 13/07/2016.
 */
'use strict';

var fs = require('fs');
var _ = require('underscore');

var html = {};

//function to open file and get file descriptor
function endOfOpen(callback) {
  return function (err, fileDescrip) {
    if (err) {
      return callback(err, null);
    }
    callback(null, fileDescrip);
  };
}
html.openFile = function (filePath, callback) {
  fs.open(filePath, 'r', endOfOpen(callback));
};

// function to retrieve, read and stringify html file
function endOfReadFile(callback) {
  return function (err, data) {
    if (err) {
      return callback(err, null);
    }
    callback(null, data);
  };
}
html.getHtml = function (filePath, callback) {
  fs.readFile(filePath, 'utf-8', endOfReadFile(callback));
};

//@params pageData - json object
//@params htmlString - data from html.getHtml
html.compilePage = function (pageData, htmlString) {
  var compiled = _.template(htmlString);
  return compiled(pageData);
};

// function to close file descriptor and return compiled html string
function endOfClose(compiledHtml, callback) {
  return function (err) {
    if (err) {
      return callback(err, null);
    }
    var htmlObj = {
      html: compiledHtml
    };
    callback(null, htmlObj);
  };
}
html.closePathDescriptor = function (fd, compiledHtml, callback) {
  fs.close(fd, endOfClose(compiledHtml, callback));
};

// main function to run html generator
//@params filePath - path to html file to compile
//@params userData - json object with data for template
function finishGetHtml(fd, userData, callback) {
  return function (err, writeTofile) {
    if (err) {
      return callback(err, null);
    }
    var template = html.compilePage(userData, writeTofile);
    html.closePathDescriptor(fd, template, callback);
  };
}

function finishOpenFile(filePath, userData, callback) {
  return function (err, fd) {
    if (err) {
      return callback(err, null);
    }
    html.getHtml(filePath, finishGetHtml(fd, userData, callback));
  };
}
html.generateHtml = function (filePath, userData, callback) {
  console.log('GENERATING HTML');
  html.openFile(filePath, finishOpenFile(filePath, userData, callback));
};

module.exports = html;