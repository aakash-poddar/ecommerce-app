import client from './client'

export async function loginApi(email, password) {
  const res = await client.post('/login', { email, password })
  return res.data
}

export async function registerApi(name, email, password, role = 'ROLE_USER') {
  // const res = await client.post('/register', { username: name, email, password, role })
  const res = await client.post('/register', { name, email, password, role })
  return res.data
}
