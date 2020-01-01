import config from '../config'

export const getUsersForPermission = () => {
  return fetch(`${config.apiUrl}/User/GetUsersForPermissions`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
    },
  }).then(response => response.json());
};

export const getAll = () => {
  return fetch(`${config.apiUrl}/User/GetUsers`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
    },
  }).then(response => response.json());
};

export const createUser = (body) => {
  return fetch(`${config.apiUrl}/User/Create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then(response => response.json());
};

export const updateUser = (body) => {
  return fetch(`${config.apiUrl}/User/Update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then(response => response.json());
};

export const deleteUser = (Id) => {
  return fetch(`${config.apiUrl}/User/Delete/${Id}`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
    },
  }).then(response => response.json());
};

export const unlockUser = (Id) => {
  return fetch(`${config.apiUrl}/User/UnlockUser/${Id}`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
    },
  }).then(response => response.json());
};