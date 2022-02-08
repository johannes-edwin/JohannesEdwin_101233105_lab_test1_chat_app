const getUrlParameter = (key) => {
  const searchParams = new URLSearchParams(window.location.search);
  if (searchParams.has(key)) {
    return searchParams.get(key);
  }
  return false;
};
