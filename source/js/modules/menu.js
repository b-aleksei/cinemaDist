import {removePreview} from './preview';

let isTouch = false;
const touchWidth = 1200;
const body = document.body;
const invertExpanded = (el) => el.getAttribute('aria-expanded') === 'false' ? 'true' : 'false';
const menuBtns = document.querySelectorAll('.category-btn, .nav__toggle');

export const toggleMenu = (btn, activeClass) => {
	  if (!isTouch) {
		return;
	}
	btn.setAttribute('aria-expanded', invertExpanded(btn));
	body.classList.toggle(activeClass);
};

if (document.documentElement.clientWidth < touchWidth) {
	isTouch = true;
}
window.addEventListener('resize', () => {
	if (document.documentElement.clientWidth > touchWidth && isTouch) {
		body.classList.remove('menu-active', 'category-active');
		menuBtns.forEach(btn => btn.setAttribute('aria-expanded', 'false'));
		isTouch = false;
		return;
	}
	if (document.documentElement.clientWidth <= touchWidth && !isTouch) {
		removePreview();
		isTouch = true;
	}
});

