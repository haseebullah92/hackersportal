import config from '../config'

export const signIn = (body) => {
  return fetch(`${config.apiUrl}/Account/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then(response => response.json());
};