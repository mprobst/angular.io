/// <reference path="../_protractor/e2e.d.ts" />
'use strict';

// Angular E2E Testing Guide:
// https://docs.angularjs.org/guide/e2e-testing

describe('PhoneCat Application', function() {

  // #docregion redirect
  it('should redirect `index.html` to `index.html#!/phones', function() {
    browser.get('index.html');
    browser.waitForAngular();
    browser.getCurrentUrl().then(function(url) {
      expect(url.endsWith('/phones')).toBe(true);
    });
  });
  // #enddocregion redirect

  describe('View: Phone list', function() {

    beforeEach(function() {
      browser.get('index.html#!/phones');
    });

    it('should filter the phone list as a user types into the search box', function() {
      let phoneList = element.all(by.css('.phones li'));
      let query = element(by.css('input'));

      expect(phoneList.count()).toBe(20);

      sendKeys(query, 'nexus');
      expect(phoneList.count()).toBe(1);

      query.clear();
      sendKeys(query, 'motorola');
      expect(phoneList.count()).toBe(8);
    });

    it('should be possible to control phone order via the drop-down menu', function() {
      let queryField = element(by.css('input'));
      let orderSelect = element(by.css('select'));
      let nameOption = orderSelect.element(by.css('option[value="name"]'));
      let phoneNameColumn = element.all(by.css('.phones .name'));

      function getNames() {
        return phoneNameColumn.map(function(elem) {
          return elem.getText();
        });
      }

      sendKeys(queryField, 'tablet');   // Let's narrow the dataset to make the assertions shorter

      expect(getNames()).toEqual([
        'Motorola XOOM\u2122 with Wi-Fi',
        'MOTOROLA XOOM\u2122'
      ]);

      nameOption.click();

      expect(getNames()).toEqual([
        'MOTOROLA XOOM\u2122',
        'Motorola XOOM\u2122 with Wi-Fi'
      ]);
    });

    // #docregion links
    it('should render phone specific links', function() {
      let query = element(by.css('input'));
      // https://github.com/angular/protractor/issues/2019
      let str = 'nexus';
      for (let i = 0; i < str.length; i++) {
        query.sendKeys(str.charAt(i));
      }
      element.all(by.css('.phones li a')).first().click();
      browser.getCurrentUrl().then(function(url) {
        expect(url.endsWith('/phones/nexus-s')).toBe(true);
      });
    });
    // #enddocregion links

  });

  describe('View: Phone detail', function() {

    beforeEach(function() {
      browser.get('index.html#!/phones/nexus-s');
    });

    it('should display the `nexus-s` page', function() {
      expect(element(by.css('h1')).getText()).toBe('Nexus S');
    });

    it('should display the first phone image as the main phone image', function() {
      let mainImage = element(by.css('img.phone.selected'));

      expect(mainImage.getAttribute('src')).toMatch(/img\/phones\/nexus-s.0.jpg/);
    });

    it('should swap the main image when clicking on a thumbnail image', function() {
      let mainImage = element(by.css('img.phone.selected'));
      let thumbnails = element.all(by.css('.phone-thumbs img'));

      thumbnails.get(2).click();
      expect(mainImage.getAttribute('src')).toMatch(/img\/phones\/nexus-s.2.jpg/);

      thumbnails.get(0).click();
      expect(mainImage.getAttribute('src')).toMatch(/img\/phones\/nexus-s.0.jpg/);
    });

  });

});
