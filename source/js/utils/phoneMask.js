const COUNTRY_CODE = '+7';

const onInputPhoneInput = ({target}) => {
  const matrix = `${COUNTRY_CODE} (___) ___-__-__`;
  const def = matrix.replace(/\D/g, '');
  let i = 0;
  let val = target.value.replace(/\D/g, '');
  if (!val.length) {
    val = def;
  }

  target.value = '';
  Array.prototype.forEach.call(matrix, (item) => {
    let isValNumber = /[_\d]/.test(item) && val.length > i;
    if (isValNumber) {
      target.value += val.charAt(i++);
    } else {
      target.value += val.length <= i ? '' : item;
    }
  });
};

const onFocusPhoneInput = (target) => {
  if (!target.value) {
    target.value = COUNTRY_CODE;
  }
  target.addEventListener('input', onInputPhoneInput);
  target.addEventListener('blur', onBlurPhoneInput);
};

const onBlurPhoneInput = ({target}) => {
  if (target.value === COUNTRY_CODE) {
    target.value = '';
  }
  target.removeEventListener('input', onInputPhoneInput);
  target.removeEventListener('blur', onBlurPhoneInput);
};

export default onFocusPhoneInput;
