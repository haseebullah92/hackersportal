import config from '../config'

export const getDocument = (id) => {
  return fetch(`${config.apiUrl}/Document/Get/${id}`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
    },
  }).then(response => response.json());
};

export const getMyDocuments = () => {
  return fetch(`${config.apiUrl}/Document/GetMyDocuments`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
    },
  }).then(response => response.json());
};

export const getOtherDocuments = () => {
  return fetch(`${config.apiUrl}/Document/GetOtherDocuments`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
    },
  }).then(response => response.json());
};


export const getDocumentPermissions = (id) => {
  return fetch(`${config.apiUrl}/Document/GetDocumentPermission/${id}`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
    },
  }).then(response => response.json());
};

export const changePermission = (body) => {
  return fetch(`${config.apiUrl}/Document/ChangeDocumentPermission`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then(response => response.json());
};

export const createDocument = (body) => {
  return fetch(`${config.apiUrl}/Document/Create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then(response => response.json());
};

export const updateDocument = (body) => {
  return fetch(`${config.apiUrl}/Document/Update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then(response => response.json());
};

export const deleteUser = (Id) => {
  return fetch(`${config.apiUrl}/Document/Delete/${Id}`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
    },
  }).then(response => response.json());
};