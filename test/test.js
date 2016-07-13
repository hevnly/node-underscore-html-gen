/**
 * Created by mario (https://github.com/hyprstack) on 13/07/2016.
 */
'use strict';

var chai = require('chai');
var sinonChai = require("sinon-chai");
var expect = chai.expect;
var sinon = require('sinon');
chai.use(sinonChai);
var proxyquire = require('proxyquire').noCallThru();

describe('generateHtml', function() {
  var testedModule,
    fakeFilePath,
    fakeJsonObj,
    callbackSpy,
    fsReadStub,
    fsCloseStub,
    fsOpenStub,
    fakeFileDescriptor,
    fakeError,
    fakeTemplate,
    fakePopulatedTemplate,
    fakeFinalObject;

  before(function() {
    fakeFilePath = 'file://fake/path/to/template.html';
    fakeJsonObj = {
      "name": "Jackson",
      "age": "69"
    };
    callbackSpy = sinon.spy();
    fsReadStub = sinon.stub();
    fsCloseStub = sinon.stub();
    fsOpenStub = sinon.stub();
    fakeFileDescriptor = 'Descriptor';
    fakeError = new Error('Error running html generator');
    fakeTemplate = "<p>My name is <%- name %>, <%- name %><%- age %>!</p>";
    fakePopulatedTemplate = "<p>My name is Jackson, Jackson69!</p>";
    fakeFinalObject = {
      html: fakePopulatedTemplate
    };
    testedModule = proxyquire('../index', {
      'fs': {
        'open': fsOpenStub,
        'close': fsCloseStub,
        'readFile': fsReadStub
      }
    });
  });

  it('should return a populated underscore template', function() {
    fsCloseStub.callsArgWith(1, null);
    fsOpenStub.callsArgWith(2, null, fakeFileDescriptor);
    fsReadStub.callsArgWith(2, null, fakeTemplate);

    testedModule.generateHtml(fakeFilePath, fakeJsonObj, function() {
      callbackSpy.apply(null, arguments);
    });

    expect(callbackSpy).has.been.called.and.has.been.calledWith(null, fakeFinalObject);
  });

  it('should return an error', function() {
    fsCloseStub.callsArgWith(1, null);
    fsOpenStub.callsArgWith(2, fakeError, null);
    fsReadStub.callsArgWith(2, null, fakeTemplate);

    testedModule.generateHtml(fakeFilePath, fakeJsonObj, function() {
      callbackSpy.apply(null, arguments);
    });

    expect(callbackSpy).has.been.called.and.has.been.calledWith(fakeError, null);
  });
});