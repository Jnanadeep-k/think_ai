let MOCK_USERS = [
  { id: 1, name: 'Test Learner', email: 'learner@test.com', password: '123456', role: 'learner' },
  { id: 2, name: 'Test Instructor', email: 'instructor@test.com', password: '123456', role: 'instructor' },
  { id: 3, name: 'Test TA', email: 'ta@test.com', password: '123456', role: 'ta' },
  { id: 4, name: 'Test Admin', email: 'admin@test.com', password: '123456', role: 'admin' },
]

export const loginApi = (credentials) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const match = MOCK_USERS.find(
        (u) => u.email === credentials.email && u.password === credentials.password
      )
      if (match) {
        const { password, ...user } = match
        resolve({
          data: {
            token: 'mock-jwt-token-' + user.role,
            user,
          },
        })
      } else {
        reject({ response: { data: { message: 'Invalid email or password' } } })
      }
    }, 500)
  })
}

export const registerApi = (formData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const exists = MOCK_USERS.some((u) => u.email === formData.email)
      if (exists) {
        reject({ response: { data: { message: 'duplicate account — email already registered' } } })
        return
      }

      const newUser = {
        id: MOCK_USERS.length + 1,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'learner',
      }
      MOCK_USERS = [...MOCK_USERS, newUser]

      const { password, ...user } = newUser
      resolve({
        data: {
          token: 'mock-jwt-token-' + user.role,
          user,
        },
      })
    }, 500)
  })
}

export const logoutApi = () => {
  return Promise.resolve({ data: { message: 'Logged out' } })
}

export const getCurrentUserApi = () => {
  return Promise.resolve({ data: { user: null } })
}

