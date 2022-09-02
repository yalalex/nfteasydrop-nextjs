export const truncate = (input) => {
  if (input.length > 15)
    return `${input.substring(0, 4)}...${input.substring(
      input.length - 4,
      input.length
    )}`;
  else return input;
};
