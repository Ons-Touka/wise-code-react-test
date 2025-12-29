import axios, { endpoints } from 'src/utils/axios';

import { STORAGE_KEY } from './constant';
import { setSession } from './utils';

// ----------------------------------------------------------------------

/**
 * Sign in
 */
export const signInWithPassword = async ({ email, password }) => {
  try {
    const params = { email, password };

    const res = await axios.post(endpoints.auth.signIn, params);

    const { token, user } = res.data;

    if (!token) {
      throw new Error('Token manquant dans la réponse');
    }

    setSession(token);

    return { user: { ...user, accessToken: token } };
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

/**
 * Sign up
 */
export const signUp = async ({ email, password, password_confirmation, firstName, lastName }) => {
  // Générer un username à partir de l'email (partie avant @)
  const username = email.split('@')[0];

  const params = {
    name: `${firstName} ${lastName}`,
    username, // AJOUT : champ username requis par l'API
    email,
    password,
    password_confirmation, // AJOUT : confirmation du mot de passe
  };

  try {
    const res = await axios.post(endpoints.auth.signUp, params);

    const { token, user } = res.data;

    if (!token) {
      throw new Error('Token manquant dans la réponse');
    }

    setSession(token);

    return { user: { ...user, accessToken: token } };
  } catch (error) {
    console.error('Error during sign up:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

/**
 * Sign out
 */
export const signOut = async () => {
  try {
    await axios.post(endpoints.auth.signOut);
    setSession(null);
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};
