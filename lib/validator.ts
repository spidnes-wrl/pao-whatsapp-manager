export function validatePhoneNumber(number: string): boolean {
  // Format: +33... ou 06...
  const phoneRegex = /^(\+33|0)[1-9](?:[0-9]{8})$/
  return phoneRegex.test(number.replace(/\s/g, ''))
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>"']/g, '')
}
