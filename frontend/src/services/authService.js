const AUTH_API_STATUS = {
  loginEndpointConfirmed: false,
  registerEndpointConfirmed: false,
};

function createUnconfirmedEndpointError(actionName) {
  return new Error(
    `${actionName} API endpoint is not confirmed yet. The backend has JWT/security helpers, but no registered auth route was found.`
  );
}

export async function login(credentials) {
  const { username, password } = credentials;

  if (!username || !password) {
    throw new Error("Username and password are required.");
  }

  if (!AUTH_API_STATUS.loginEndpointConfirmed) {
    throw createUnconfirmedEndpointError("Login");
  }

  /*
    Future implementation after backend contract is confirmed:

    return apiClient("/confirmed-login-endpoint", {
      method: "POST",
      body: {
        username,
        password,
      },
    });

    Do not add endpoint paths until the FastAPI auth API exists.
  */
}

export async function registerAccount(accountData) {
  const { username, password, confirmPassword } = accountData;

  if (!username || !password || !confirmPassword) {
    throw new Error("Username, password, and confirm password are required.");
  }

  if (password !== confirmPassword) {
    throw new Error("Password and confirm password do not match.");
  }

  if (!AUTH_API_STATUS.registerEndpointConfirmed) {
    throw createUnconfirmedEndpointError("Register");
  }

  /*
    Future implementation after backend contract is confirmed:

    return apiClient("/confirmed-register-endpoint", {
      method: "POST",
      body: {
        username,
        password,
      },
    });

    Do not add endpoint paths until the FastAPI auth API exists.
  */
}

export function getAuthApiStatus() {
  return { ...AUTH_API_STATUS };
}