import Cookies from 'js-cookie';
import { PostTypes } from '../Global';
import { apiUrl } from '../Const';

export const submitSignUp = async (username: string, email: string, password: string) => {
  const url = apiUrl + '/account/signup';
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
      return { success: false, message: result.msg };
    }
    else if (response.status == 200) {
      return { success: true, message: result.msg };
    }
    else {
      return {
        success: false, message:
          "Unknown error with status code " + response.status + " and message " + result.msg + "."
      };
    }

  } catch (error) {
    console.error('Error during signup:', error);
  }
};

export const submitSignIn = async (username: string, password: string) => {
  const url = apiUrl + '/account/signin';
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
      return { success: false, message: result.msg };
    }
    else if (response.status == 200) {
      return { success: true, message: result };
    }
    else {
      return {
        success: false, message:
          "Unknown error with status code " + response.status + " and message " + result.msg + "."
      };
    }

  } catch (error) {
    console.error('Error during signin:', error);
  }
}

export async function jwtCheck() {
  const storedToken = Cookies.get('jwtToken');
  const url = apiUrl + '/auth/check';
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${storedToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const result = await response.json();
    return result;
  } catch (error) {
    return false;
  }
}

export async function fetchForumData(title: string, topic: string, offset: number, chunkSize: number) {
  const storedToken = localStorage.getItem('jwtToken');
  const url = apiUrl + '/forum';

  const queryParams = new URLSearchParams({
    title,
    topic,
    offset: offset.toString(),
    chunksize: chunkSize.toString()
  });
  const fullUrl = url + `?${queryParams.toString()}`;

  try {
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${storedToken}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      const errorBody = await response.json();
      const errorMessage = errorBody.error || 'Unknown error occurred';
      throw new Error(errorMessage);
    }
    const data = await response.json();
    return { success: true, data: data };
  } catch (error: unknown) {
    let errorMessage = 'An unexpected error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error('Fetch error:', errorMessage);
    return { success: false, error: errorMessage, data: null };
  }
}

export async function newPost(title: string, topic: PostTypes, content: string) {
  const storedToken = Cookies.get('jwtToken');
  const url = apiUrl + '/auth/newpost';

  const data = new URLSearchParams({
    title,
    topic,
    content,
  })

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${storedToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: data,
    });

    const result = await response.json();

    if (!response.ok) {
      const errorBody = await response.json();
      const errorMessage = errorBody.error || 'Unknown error occurred';
      throw new Error(errorMessage);
    }
    
    const newPost_id = result.new_post_id;
    return { success: true, data: newPost_id };

  } catch (error: unknown) {
    let errorMessage = 'An unexpected error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error('New post error:', errorMessage);
    return { success: false, error: errorMessage, data: null };
  }
}

export async function getPostAndComments(post_id: number, offset: number, chunkSize: number) {
  const storedToken = localStorage.getItem('jwtToken');
  const url = apiUrl + `/post/${post_id}`;

  const queryParams = new URLSearchParams({
    post_id: post_id.toString(),
    offset: offset.toString(),
    chunksize: chunkSize.toString(),
  });
  const fullUrl = `${url}?${queryParams.toString()}`;

  try {
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${storedToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorBody = await response.json();
      const errorMessage = errorBody.error || 'Unknown error occurred';
      throw new Error(errorMessage);
    }
    const data = await response.json();
    return { success: true, data: data };
  } catch (error: unknown) {
    let errorMessage = 'An unexpected error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error('Get post error:', errorMessage);
    return { success: false, error: errorMessage, data: null };
  }
}

export async function newComment(post_id: string, content: string) {
  const storedToken = Cookies.get('jwtToken');
  const url = apiUrl + '/auth/comment';

  const data = new URLSearchParams({
    post_id: post_id,
    content: content,
  })

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${storedToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: data,
    });

    const result = await response.json();

    if (!response.ok) {
      const errorBody = await response.json();
      const errorMessage = errorBody.error || 'Unknown error occurred';
      throw new Error(errorMessage);
    }
    
    const newPost_id = result.new_post_id;
    return { success: true, data: newPost_id };
  } catch (error: unknown) {
    let errorMessage = 'An unexpected error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error('New comment error:', errorMessage);
    return { success: false, error: errorMessage, data: null };
  }
}

// authRoute.PUT("/updatecomment/:commet_id", func(c *gin.Context) { controller.UpdateComment(c, db_conn) })
// authRoute.DELETE("/deletecomment/:comment_id", func(c *gin.Context) { controller.DeleteComment(c, db_conn) })

export async function updateComment(post_id: number, comment_id: number, content: string) {
  const storedToken = Cookies.get('jwtToken');
  const url = `${apiUrl}/auth/updatecomment/`;

  const data = new URLSearchParams({
    post_id: post_id.toString(),
    comment_id: comment_id.toString(),
    content: content,
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${storedToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: data,
    });

    if (!response.ok) {
      const errorBody = await response.json();
      const errorMessage = errorBody.error || 'Unknown error occurred';
      throw new Error(errorMessage);
    }

    return { success: true };
  } catch (error) {
    let errorMessage = 'An unexpected error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error('Update comment error:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

export async function deleteComment(post_id: number, comment_id: number) {
  const storedToken = Cookies.get('jwtToken');
  const url = `${apiUrl}/auth/deletecomment/`;

  const data = new URLSearchParams({
    post_id: post_id.toString(),
    comment_id: comment_id.toString(),
  });

  try {
    const response = await fetch(url, {
      method: 'POST', // couldnt get delete to work
      headers: {
        'Authorization': `Bearer ${storedToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: data
    });

    if (!response.ok) {
      const errorBody = await response.json();
      const errorMessage = errorBody.error || 'Unknown error occurred';
      throw new Error(errorMessage);
    }

    return { success: true };
  } catch (error) {
    let errorMessage = 'An unexpected error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error('Delete comment error:', errorMessage);
    return { success: false, error: errorMessage };
  }
}
