import Bowser from 'bowser'

export const browser = Bowser.getParser(window.navigator.userAgent)

export const isIOS = () => {
  return browser.getOSName() === 'iOS'
}
