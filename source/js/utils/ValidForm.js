import onFocusPhoneInput from './phoneMask';
import {objModal} from './modal';

const config = {
	regEmail: /^\s*[\w.-]+@[\w-]+\.(?:[\w-]+\.)?[A-Za-z]{2,8}\s*$/,
};

let errorMessages = {
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
		errorMessages = JSON.parse(xhr.response);
	}
};

// fetch(url).then((res) => res.json()).then((res) => errorMessages = res).catch(() => {});

export class Validate {
	constructor(form, conf) {
	  this.form = form;
	  this.defaultConfig = {
	    url: 'https://echo.htmlacademy.ru',
	    transferInfo: {
	      success: 'Данные успешно обновлены',
	      bad: 'Удаленный сервер не найден',
	      error: 'Сервер недоступен',
			},
		};

		this.config = Object.assign(this.defaultConfig, conf);
		this.init();
	}

	init() {
		this.form.addEventListener('focusin', this);
		this.form.addEventListener('focusout', this);
		this.form.addEventListener('click', this);
		this.form.addEventListener('submit', this);
	}

	handleEvent(e) {
		switch (e.type) {
		case 'focusin':
			if (e.target.hasAttribute('data-validate')) {
				e.target.setCustomValidity('');
				if (e.target.dataset.validate === 'phone') {
					onFocusPhoneInput(e.target);
				}
			}
			break;
		case 'focusout':
			if (e.target.hasAttribute('data-validate')) {
				this.checkValue(e.target);
			}
			break;
		case 'click':
			if (e.target.closest('[type="submit"]')) {
				const inputs = e.currentTarget.querySelectorAll('[data-validate]:not([disabled])');
				inputs.forEach((input) => {
					input.parentElement.classList.add('validate');
					this.checkValue(input);
				});
			}
			break;
		case 'submit':
			e.preventDefault();
			this.sendData(this.form);
		}
	}

	setErrorMes(target, message) {
		const errorEl = target.parentElement.querySelector('[data-error]');
		if (errorEl) {
			errorEl.innerText = message;
		}
		target.setCustomValidity(message);
	}

	checkValue(target) {
		target.parentElement.classList.add('validate');
		if (!target.value && target.required) {
			this.setErrorMes(target, errorMessages.required);
			return;
		}

		if (target.dataset.validate === 'email') {
			target.value = target.value.trim();
			if (target.value && !config.regEmail.test(target.value)) {
				this.setErrorMes(target, errorMessages.email);
				return;
			}
		}

		if (target.dataset.validate === 'phone') {
			setTimeout(() => {
				const phoneLength = target.value.replace(/\D/g, '').length;
				if (target.value && phoneLength < 11) {
					this.setErrorMes(target, errorMessages.phone);
				}
			});
		}
	}

	beforeSending() {
		const spinner = document.querySelector('#spinner');
		if (spinner) {
			spinner.classList.remove('hidden');
			objModal.frozen = true;
		}
	}

	afterSending() {
		const spinner = document.querySelector('#spinner');
		if (spinner) {
			spinner.classList.add('hidden');
			objModal.frozen = false;
		}
	}

	transferAction(status) {
		if (status === 'success') {
			console.log('success');
			window.location.pathname = '/auth.html';
		} else {
			const modalInfo = document.querySelector('#modal-success');
			if (modalInfo) {
				const title = modalInfo.querySelector('h2');
				title.innerText = this.config.transferInfo[status];
				objModal.open(modalInfo, true);
			}
		}
	}

	sendData(form) {
		this.beforeSending();
		const xhr = new XMLHttpRequest();
		xhr.open('POST', this.config.url);
		xhr.onload = () => {
			if (xhr.status === 200) {
				this.transferAction('success');
				form.reset();
				const inputs = form.querySelectorAll('[data-validate]:not(:disabled)');
				inputs.forEach((input) => {
					input.parentElement.classList.remove('validate');
				});
			} else {
				this.transferAction('bad');
			}
			this.afterSending();
		};
		xhr.send(new FormData(form));
		/*    fetch(this.config.url, {
      method: 'post',
      body: new FormData(form),
    }).then((res) => {
      if (res.ok) {
        this.transferAction('success');
        form.reset();
        const inputs = form.querySelectorAll('[data-validate]:not(:disabled)');
        inputs.forEach((input) => {
          input.parentElement.classList.remove('validate');
        });
      } else {
        this.transferAction('bad');
      }
    }).catch(() => {
      this.transferAction('error');
    }).finally(() => {
      this.afterSending();
    });*/
	}
}
