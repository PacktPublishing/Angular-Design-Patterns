export class AngularObservablePage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('angular-observable-app h1')).getText();
  }
}
