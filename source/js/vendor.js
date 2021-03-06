import './vendor/ios-vh-fix';
import {ieFix} from './vendor/polyfills';
import {objectFitImages} from './vendor/ofi.min';
import './vendor/picturefill.min';
ieFix();

require('intersection-observer');
// import 'focus-visible';

const isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
if (isIE11) {
  const images = document.querySelectorAll('img[data-object-fit]');
  objectFitImages(images);
}


