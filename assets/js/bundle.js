(() => {
  const selector = selector => document.querySelector(selector);
  const create = element => document.createElement(element);

  const app = selector('#app');

  const Login = create('div');
  Login.classList.add('login');

  const Logo = create('img');
  Logo.src = './assets/images/logo.svg';
  Logo.classList.add('logo');

  const Form = create('form');

  Form.onsubmit = async e => {
    e.preventDefault();
    const [email, password] = e.target.parentElement.children[0];

    const { url } = await fakeAuthenticate(email.value, password.value);

    location.href = '#users';

    const users = await getDevelopersList(url);
    renderPageUsers(users);
  };

  Form.oninput = e => {
    const [email, password, button] = e.target.parentElement.children;
    !email.validity.valid || !email.value || password.value.length <= 5
      ? button.setAttribute('disabled', 'disabled')
      : button.removeAttribute('disabled');
  };

  Form.innerHTML = `<input type="email" name="email" required placeholder="Entre com seu email">
    <input type="password" name="password" required placeholder="Digite sua senha super secreta">
    <button type="submit">Entrar</button>`;

  app.appendChild(Logo);
  Login.appendChild(Form);

  async function fakeAuthenticate(email, password) {
    const response = await fetch(
      'http://www.mocky.io/v2/5dba690e3000008c00028eb6'
    );

    const data = await response.json();

    const fakeJwtToken = `${btoa(email + password)}.${btoa(
      data.url
    )}.${new Date().getTime() + 300000}`;

    localStorage.setItem('token', fakeJwtToken);

    return data;
  }

  async function getDevelopersList(url) {
    const response = await fetch(url);
    return await response.json();
  }

  function renderPageUsers(users) {
    app.classList.add('logged');
    Login.style.display = 'none';

    const Ul = create('ul');
    Ul.classList.add('container');

    for (let { avatar_url, html_url, login } of users) {
      const Li = create('li');
      const a = create('a');
      a.href = html_url;

      const Img = create('img');
      Img.src = avatar_url;

      a.innerText = login;

      Li.appendChild(Img);
      Li.appendChild(a);
      Ul.appendChild(Li);
    }

    app.appendChild(Ul);
  }

  // init
  (async function() {
    const rawToken = localStorage.getItem('token');
    const token = rawToken ? rawToken.split('.') : null;
    if (!token || token[2] < new Date().getTime()) {
      localStorage.removeItem('token');
      location.href = '#login';
      app.appendChild(Login);
    } else {
      location.href = '#users';
      const users = await getDevelopersList(atob(token[1]));
      renderPageUsers(users);
    }
  })();
})();
