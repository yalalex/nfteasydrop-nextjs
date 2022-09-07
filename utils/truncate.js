export const truncate = (input) => {
  if (input.length > 15)
    return `${input.substring(0, 5)}...${input.substring(
      input.length - 5,
      input.length
    )}`;
  else return input;
};
