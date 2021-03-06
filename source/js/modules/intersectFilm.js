document.addEventListener('DOMContentLoaded', () => {
	const lazyImages = [].slice.call(document.querySelectorAll('.lazy-img'));
	let delay = 1;

	if ('IntersectionObserver' in window) {
		const lazyFilmObserver = new IntersectionObserver((entries) => {
			entries.forEach((img) => {
				if (img.isIntersecting) {
					img.target.style.transitionDelay = `0.${delay++}s`;
					img.target.classList.remove('inv');
					const source = img.target.querySelector('source');
					if (source) {
					  source.srcset = source.dataset.srcset;
					}
					lazyFilmObserver.unobserve(img.target);
				}
			});
			delay = 1;
		});

		lazyImages.forEach((img) => lazyFilmObserver.observe(img));
	}
});
