export async function loginRequest(credentials) {
  const username = credentials?.username?.trim();
  const password = credentials?.password?.trim();

  if (!username || !password) {
    throw new Error("Username and password are required.");
  }

  // TEMPORARY DEV LOGIN
  // This fake token exists only so we can test frontend auth state,
  // ProtectedRoute, DashboardLayout, and nested dashboard routes.
  // Remove this when the FastAPI login endpoint is implemented.
  return {
    access_token: `dev-token-${Date.now()}`,
    token_type: "bearer",
  };
}

export async function registerAccount(accountData) {
  const username = accountData?.username?.trim();
  const password = accountData?.password;
  const confirmPassword = accountData?.confirmPassword;

  if (!username || !password || !confirmPassword) {
    throw new Error("All fields are required.");
  }

  if (password.length < 6) {
    throw new Error("Password should be at least 6 characters.");
  }

  if (password !== confirmPassword) {
    throw new Error("Passwords do not match.");
  }

  // TEMPORARY DEV REGISTER
  // Backend registration endpoint is not implemented yet.
  // This exists only so RegisterPage can be loaded and tested.
  return {
    id: `dev-user-${Date.now()}`,
    username,
    message: "Temporary account created successfully.",
  };
}