const API_URL = 'https://66bd590b74dfc195586c67d0.mockapi.io/';

export const getCount = async (id: string) =>
  await fetch(`${API_URL}/count/${id}`, {
    method: 'GET',
  })
    .then((res) => res.json())
    .then(({ value }) => value as number);

export const increaseCount = async (id: string, curr: number) =>
  await fetch(`${API_URL}/count/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      value: curr + 1,
    }),
  })
    .then((res) => res.json())
    .then(({ value }) => value as number);

export const resetCount = async (id: string) =>
  await fetch(`${API_URL}/count/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      value: 0,
    }),
  })
    .then((res) => res.json())
    .then(({ value }) => value as number);
