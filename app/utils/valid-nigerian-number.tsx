// A simple validation function
export const isValidNigerianNumber = (phone: string) => {
  // Remove any non-digit characters (e.g., spaces, dashes)
  const cleanedPhone = phone.replace(/\D/g, "");

  // Check for the correct length (11 digits for local, 13 for international)
  if (cleanedPhone.length === 11) {
    // Check if it starts with a valid Nigerian local code (070, 080, 081, 090, 091)
    return ["070", "080", "081", "090", "091"].some((prefix) =>
      cleanedPhone.startsWith(prefix)
    );
  } else if (cleanedPhone.length === 13) {
    // Check if it starts with the international code +234
    return cleanedPhone.startsWith("234");
  }

  // If none of the above conditions are met, the number is invalid
  return false;
};
