
export const validateCNS = (cns: string): boolean => {
  // Remove any non-numeric characters
  const cleanCNS = cns.replace(/\D/g, '');
  
  // Must have exactly 15 digits
  if (cleanCNS.length !== 15) {
    return false;
  }
  
  // Check if it's not all repeated numbers (like 111111111111111)
  const allSameDigit = /^(\d)\1{14}$/.test(cleanCNS);
  if (allSameDigit) {
    return false;
  }
  
  return true;
};

export const formatCNS = (cns: string): string => {
  const cleanCNS = cns.replace(/\D/g, '');
  if (cleanCNS.length <= 15) {
    return cleanCNS.replace(/(\d{3})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4').trim();
  }
  return cleanCNS;
};
