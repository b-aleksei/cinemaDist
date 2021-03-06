import parallax from './modules/parallax';
import video from './modules/video';
import fileLoad from './modules/fileLoad';
import {showPassword} from './modules/helper';
import {toggleMenu} from './modules/menu';
import './modules/intersectFilm';
import {showPreview} from './modules/preview';
import {Validate} from './utils/ValidForm';


parallax();
video();
fileLoad();

const debounceDelay = 300;
let timer = null;

document.addEventListener('click', (e) => {
	const showPass = e.target.closest('.show-password');
	const navButton = e.target.closest('.nav__toggle');
	const categoryBtn = e.target.closest('.category-btn');
	const btnDetails = e.target.closest('.film__watch');

	if (btnDetails) {
		if (!timer) {
			showPreview(btnDetails);
		}
		clearTimeout(timer);
		timer = setTimeout(() => timer = null, debounceDelay);
	}

	if (showPass) {
		showPassword(showPass);
	}

	if (navButton) {
	  toggleMenu(navButton, 'menu-active');
	}

	if (categoryBtn) {
	  toggleMenu(categoryBtn, 'category-active');
	}
}, {passive: true});


const authForm = document.querySelector('.profile');
if (authForm) {
	new Validate(authForm);
}


const mainSlider = document.querySelector('.banner');
if (mainSlider) {
	new Flickity(mainSlider, {
		wrapAround: true,
		setGallerySize: false,
		autoPlay: true,
		prevNextButtons: false,
		// watchCSS: true,
	});
}

const categorySlider = document.querySelector('.favorite__list');
if (categorySlider) {
	new Flickity(categorySlider, {
		cellAlign: 'left',
		freeScroll: true,
		contain: true,
		prevNextButtons: false,
		pageDots: false,
	});
}

const detailsSlider = document.querySelector('.details-slider');
if (detailsSlider) {
	new Flickity(detailsSlider, {
		cellAlign: 'left',
		freeScroll: true,
		contain: true,
		prevNextButtons: false,
		pageDots: false,
		setGallerySize: false,
	});
}
