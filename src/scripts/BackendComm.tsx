export const submitSignUp = async (username: string, email: string, password: string) => {
  const url = 'http://localhost:8080/account/signup';
  const data = new URLSearchParams({
    username,
    email,
    password,
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: data
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (response.status == 409) {
      return {success: false, message: result.msg};
    }
    else if (response.status == 200) {
      console.log('SignUp successful:', result);
      return {success: true, message: result.msg};
    }
    else{
      return {success: false, message: 
        "Unknown error with status code " + response.status + " and message " + result.msg + "."};
    }

  } catch (error) {
    console.error('Error during signup:', error);
  }
};
  
export const submitSignIn = async (username: string, password: string) => {
  const url = 'http://localhost:8080/account/signin';
  const data = new URLSearchParams({
    username,
    password,
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: data
    });

    const result = await response.json();

    if (response.status == 401) {
      return {success: false, message: result.msg};
    }
    else if (response.status == 200) {
      return {success: true, message: result};
    }
    else{
      return {success: false, message: 
        "Unknown error with status code " + response.status + " and message " + result.msg + "."};
    }

  } catch (error) {
    console.error('Error during signin:', error);
  }
}

export const authHome = async (storedToken: string, onAuth: (valid: boolean) => void) => {
  try{
    const url = 'http://localhost:8080/home';
  
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${storedToken}`,
      }
    });

    // const result = await response.json();
    
    onAuth(response.status == 200);
  } catch (error) {
    console.log("Error duing auth:", error)
    onAuth(false);
  }
}