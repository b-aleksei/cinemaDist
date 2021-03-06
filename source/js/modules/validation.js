import onFocusPhoneInput from '../utils/phoneMask';

const regEmail = /^\s*[\w.-]+@[\w-]+\.(?:[\w-]+\.)?[A-Za-z]{2,8}\s*$/;
let errorMes = {
	required: '',
	phone: '',
	email: '',
};

const url = 'data/errorMes.json';
const xhr = new XMLHttpRequest();
xhr.open('GET', url);
xhr.send();
xhr.onload = () => {
	if (xhr.status === 200) {
		errorMes = JSON.parse(xhr.response);
	}
};
// fetch(url).then((res) => res.json()).then((res) => errorMes = res).catch(() => {});

const setErrorMes = (target, message) => {
	const errorEl = target.parentElement.querySelector('[data-error]');
	if (errorEl) {
		errorEl.innerText = message;
	}
	target.setCustomValidity(message);
};

const checkValue = (target) => {
	target.parentElement.classList.add('validate');
	if (!target.value && target.required) {
		setErrorMes(target, errorMes.required);
		return;
	}

	if (target.dataset.validate === 'email') {
		target.value = target.value.trim();
		if (target.value && !regEmail.test(target.value)) {
			setErrorMes(target, errorMes.email);
			return;
		}
	}

	if (target.dataset.validate === 'phone') {
		setTimeout(() => {
			const phoneLength = target.value.replace(/\D/g, '').length;
			console.log(target.value, target.value.length);
			if (target.value && phoneLength < 11) {
				setErrorMes(target, errorMes.phone);
			}
		});
	}
};

const onFocusForm = ({target}) => {
	if (target.hasAttribute('data-validate')) {
		target.setCustomValidity('');
		if (target.dataset.validate === 'phone') {
			onFocusPhoneInput(target);
		}
	}
};

const onBlurForm = ({target}) => {
	if (target.hasAttribute('data-validate')) {
		checkValue(target);
	}
};

const preSubmit = (e) => {
	if (e.target.closest('[type="submit"]')) {
		const inputs = e.currentTarget.querySelectorAll('[data-validate]:not([disabled])');
		inputs.forEach((input) => {
			input.parentElement.classList.add('validate');
			checkValue(input);
		});
	}
};

const onSubmit = (e) => {
	e.preventDefault();
};

export const initForm = function(form) {
	form.addEventListener('click', preSubmit);
	form.addEventListener('focusin', onFocusForm);
	form.addEventListener('submit', onSubmit);
	form.addEventListener('focusout', onBlurForm);
};
