export function UsernameValidate(username: string): string {
    if (username.length < 4) {
      return "Username must be at least 4 characters long.";
    }
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      return "Username must contain only alphanumeric characters.";
    }
    
    return "Valid";
}

export function PasswordValidate(password: string): string {
    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (!/^[a-zA-Z0-9]+$/.test(password)) {
      return "Password must contain only alphanumeric characters.";
    }
    if (!/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
      return "Password must contain at least one number and one letter.";
    }
  
    return "Valid";
}

export function EmailValidate(email: string): string {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Invalid email format.";
    }
    
    return "Valid";
  }