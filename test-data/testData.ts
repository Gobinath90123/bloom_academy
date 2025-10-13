export const testData = {
  url: 'https://staging.bloomscareer.com/login',

  // Valid credentials
  validUser: {
    username: '9952234924',
    password: '12345',
  },

  // Invalid credentials (for negative test cases)
  invalidUser: {
    username: '9789440594',
    username2: 'abcd',
    password: 'abcd',  // can add more invalid passwords later
  },

};