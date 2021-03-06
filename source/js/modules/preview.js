
const previewTemplate = document.querySelector('.preview');

const itemsInRow = 4;
let activePreview = null;
let currentParent = null;
let currentStarter = null;

const cashe = {};

const insertChild = (index, parent, arrEls) => {
	if (activePreview) {
		removePreview();
	}
	const preview = previewTemplate.cloneNode(true);
	const btnClose = preview.querySelector('.preview__close');
	btnClose.addEventListener('click', () => {
		removePreview();
	});

	preview.dataset.index = index;
	updateModalField(preview);
	arrEls[index - 1].after(preview);
	setTimeout(() => {
		activePreview = preview;
		document.addEventListener('keydown', (e) => {
			if (activePreview && e.key === 'Escape') {
				removePreview();
			}
		}, {once: true});
		preview.classList.add('preview--visible');
	}, 200);
};

export const removePreview = () => {
	if (activePreview) {
		activePreview.addEventListener('transitionend', function() {
			this.remove();
		}, {once: true});
		activePreview.classList.remove('preview--visible');
		activePreview = null;
		currentStarter.focus();
	}
};

const updateModalField = (modal) => {
	console.log('updateModalField from server', modal);
};

const getRowForPreview = (index, parent, arrEls) => { // определяем после какого ряда добавить preview окно
	if (index === -1) {
		return;
	}
	let reviewIndex = null;
	const totalRows = Math.ceil(arrEls.length / itemsInRow);
	for (let i = itemsInRow; i <= totalRows * itemsInRow; i += itemsInRow) {
	  if (index < i) {
			reviewIndex = i;
			break;
	  }
	}

	// если открыто превью и мы нажимаем на другом ряду, закрываем предыдущее окно
	if (activePreview && +activePreview.dataset.index === reviewIndex && currentParent === parent) {
		updateModalField(activePreview);
		return;
	}

	currentParent = parent;
	insertChild(reviewIndex, parent, arrEls);
};

export const showPreview = (btn) => {
	const filmsParent = btn.closest('.film-list');
	if (!filmsParent || !previewTemplate) {
		return;
	}
	currentStarter = btn;
	const id = btn.dataset.details;
	const films = [].slice.call(filmsParent.querySelectorAll('.film-item'));
	const index = films.indexOf(document.getElementById(id));
	getRowForPreview(index, filmsParent, films);
};
