export default () => {
	const play = document.querySelector('#play-trailer');
	const video = document.querySelector('video');
	const trailerWrap = document.querySelector('.trailer__wrap');

	if (!play || !video || !trailerWrap) {
		return;
	}

	play.addEventListener('click', () => {
		trailerWrap.classList.add('playing');
		// video.firstElementChild.src = video.firstElementChild.dataset.src;
		// video.load();
		video.play();
	}, {once: true});
};
