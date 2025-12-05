"use client";

const LOGIN_KEY = "login";
const LOGIN_VALUE = "true";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // one week

/**
 * Persists login state in localStorage and a cookie so middleware can read it.
 */
export const setLoginState = (): void => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(LOGIN_KEY, LOGIN_VALUE);
  } catch (error) {
    console.error(error);
  }
  document.cookie = `${LOGIN_KEY}=${LOGIN_VALUE}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}`;
};

/**
 * Clears login indicators from both client storage and cookies.
 */
export const clearLoginState = (): void => {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(LOGIN_KEY);
    } catch (error) {
      console.error(error);
    }
  }
  if (typeof document !== "undefined") {
    document.cookie = `${LOGIN_KEY}=; path=/; max-age=0`;
  }
};

/**
 * Checks whether the client considers the user logged in.
 * @returns True when login cookie or localStorage flag is present.
 */
export const isLoggedInClient = (): boolean => {
  if (typeof document === "undefined" || typeof window === "undefined") {
    return false;
  }
  const fromCookie = document.cookie
    .split(";")
    .map((entry) => entry.trim())
    .some((entry) => entry === `${LOGIN_KEY}=${LOGIN_VALUE}`);
  const fromStorage = window.localStorage.getItem(LOGIN_KEY) === LOGIN_VALUE;
  return fromCookie || fromStorage;
};
