export const truncate = (input) => {
  if (input.length > 15)
    return `${input.substring(0, 6)}...${input.substring(
      input.length - 6,
      input.length
    )}`;
  else return input;
};
