export const isValidTweetUrl = (url: string): boolean => {
  return /(?:http)?(?:s:\/\/)?(?:www\.)?twitter\.com\/([a-zA-Z0-9_]+)\/status\/[0-9]{19}/.test(url);
};
