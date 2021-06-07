import Dialog from '@nextgis/dialog';

import type { Credentials } from '@nextgis/ngw-connector';

export function showLoginDialog(defAuth?: Credentials): Promise<Credentials> {
  return new Promise((resolve, reject) => {
    const dialog = new Dialog();
    const onResolve = (auth: Credentials) => {
      dialog.close();
      resolve(auth);
    };
    const onReject = (er: Error) => {
      dialog.close();
      reject(er);
    };
    if (defAuth) {
      const html = createDialogHtml(defAuth, onResolve, onReject);
      dialog.updateContent(html);
      dialog.show();
    }
  });
}

export function createDialogHtml(
  defAuth: Credentials,
  resolve: (cred: Credentials) => void,
  reject: (...args: any[]) => void,
): HTMLElement | undefined {
  if (defAuth && defAuth.login && defAuth.password) {
    const { login, password } = defAuth;
    const form = document.createElement('div');
    form.className = 'ngw-uploader__login-dialog--form';
    const formHtml = `
      <div><label><div>Name:</div>
        <input value=${login} class="ngw-uploader__login-dialog--input name"></input>
      </label></div>
      <div><label><div>Password:</div>
        <input value=${password} type="password" class="ngw-uploader__login-dialog--input password"></input>
      </label></div>
      <button class="ngw-uploader__login-dialog--button login">Login</button>
      <button class="ngw-uploader__login-dialog--button cancel">Cancel</button>
    `;
    form.innerHTML = formHtml;
    const loginElement = form.getElementsByClassName(
      'name',
    )[0] as HTMLInputElement;
    const passwordElement = form.getElementsByClassName(
      'password',
    )[0] as HTMLInputElement;
    const loginBtn = form.getElementsByClassName(
      'login',
    )[0] as HTMLButtonElement;
    const cancelBtn = form.getElementsByClassName(
      'cancel',
    )[0] as HTMLButtonElement;
    const getAuthOpt: () => Credentials = () => {
      return {
        login: loginElement.value,
        password: passwordElement.value,
      };
    };
    const validate = () => {
      const auth = getAuthOpt();
      if (auth.login && auth.password) {
        loginBtn.disabled = false;
      } else {
        loginBtn.disabled = true;
      }
    };
    const onInputChange = () => {
      validate();
    };

    const addEventListener = () => {
      [loginElement, passwordElement].forEach((x) => {
        ['change', 'input'].forEach((y) =>
          x.addEventListener(y, onInputChange),
        );
      });
    };
    const removeEventListener = () => {
      [loginElement, passwordElement].forEach((x) => {
        ['change', 'input'].forEach((y) =>
          x.removeEventListener(y, onInputChange),
        );
      });
    };
    loginBtn.onclick = () => {
      removeEventListener();
      resolve(getAuthOpt());
    };
    cancelBtn.onclick = () => {
      removeEventListener();
      reject('Login cancel');
    };
    validate();
    addEventListener();
    return form;
  }
}
