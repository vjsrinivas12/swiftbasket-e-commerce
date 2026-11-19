/**
 * Validation rules for the checkout delivery address form.
 */
export const addressValidators = {
  fullName: (value) => {
    if (!value || !value.trim()) return "Full name is required";
    if (value.trim().length < 2) return "Name must be at least 2 characters";
    return "";
  },
  mobile: (value) => {
    if (!value || !value.trim()) return "Mobile number is required";
    if (!/^[6-9]\d{9}$/.test(value.trim()))
      return "Enter a valid 10-digit mobile number";
    return "";
  },
  flat: (value) => {
    if (!value || !value.trim()) return "House / Flat details are required";
    return "";
  },
  pincode: (value) => {
    if (!value || !value.trim()) return "Pincode is required";
    if (!/^\d{6}$/.test(value.trim())) return "Enter a valid 6-digit pincode";
    return "";
  },
};
