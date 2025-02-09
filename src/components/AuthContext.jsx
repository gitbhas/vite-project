import { createContext, useContext, useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      setUser(user);
    } catch (error) {
      setUser(null);
    }
    setLoading(false);
  };

  const signIn = async (username, password) => {
    try {
      console.log('Attempting sign in with:', { username });
      const user = await Auth.signIn(username, password);
      setUser(user);
      return user;
    } catch (error) {
      console.error('Sign in error:', {
        code: error.code,
        name: error.name,
        message: error.message,
        error
      });
      if (error.code === 'NotAuthorizedException') {
        throw new Error('Incorrect username or password');
      } else if (error.code === 'UserNotFoundException') {
        throw new Error('User does not exist');
      } else if (error.code === 'InvalidParameterException') {
        throw new Error('Please check your username/password format');
      }
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await Auth.signOut();
      setUser(null);
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};