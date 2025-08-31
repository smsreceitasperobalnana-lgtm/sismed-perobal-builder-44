
export const validateCNS = (cns: string): boolean => {
  // Remove any non-numeric characters
  const cleanCNS = cns.replace(/\D/g, '');
  
  // Must have exactly 15 digits
  if (cleanCNS.length !== 15) {
    return false;
  }
  
  // Basic CNS validation algorithm (simplified)
  const weights1 = [15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
  const weights2 = [3, 2, 1, 0, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 9];
  
  let sum = 0;
  for (let i = 0; i < 15; i++) {
    sum += parseInt(cleanCNS[i]) * weights1[i];
  }
  
  let remainder = sum % 11;
  let dv = remainder < 2 ? 0 : 11 - remainder;
  
  if (dv !== parseInt(cleanCNS[14])) {
    // Try alternative calculation
    sum = 0;
    for (let i = 0; i < 15; i++) {
      sum += parseInt(cleanCNS[i]) * weights2[i];
    }
    remainder = sum % 11;
    dv = remainder < 2 ? 0 : 11 - remainder;
    return dv === parseInt(cleanCNS[14]);
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
