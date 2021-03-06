
export const showPassword = (btn) => {
  const input = btn.parentElement.querySelector('input');

  if (btn.classList.contains('show')) {
    btn.classList.remove('show');
    input.type = 'password';
  } else {
    btn.classList.add('show');
    input.type = 'text';
  }
};
