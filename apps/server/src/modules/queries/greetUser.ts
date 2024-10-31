const greetUser = (_, { name }) => {
  return `Hello, ${name || 'World'}! `;
};

export default greetUser;
