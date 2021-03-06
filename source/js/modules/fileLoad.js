export default () => {
  const avatar = document.querySelector('.avatar-profile img');
  const fileLoader = document.querySelector('#fileLoader');

  if (!avatar || !fileLoader) {
    return;
  }

  fileLoader.addEventListener('change', ({target}) => {
    avatar.src = URL.createObjectURL(target.files[0]);
  });
};
