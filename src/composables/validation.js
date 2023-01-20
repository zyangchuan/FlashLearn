const required = (value) => {
  if (value) {
    return true
  } else {
    return "This field is required."
  }
}

const match = (value, matchValue) => {
  if (value === matchValue) {
    return true
  } else {
    return "Passwords do not match."
  }
}

const minLength = (value, minLength) => {
  if (value.length >= minLength) {
    return true
  } else {
    return `Must be at least ${minLength} characters long.`
  }
}

const maxLength = (value, maxLength) => {
  if (value.length <= maxLength) {
    return true
  } else {
    return `Must not be more than ${maxLength} characters long.`
  }
}

const includeLetters = (value) => {
  if (/[a-z]/.test(value)) {
    return true
  } else {
    return "Password must include a lower case letter."
  }
}

const includeNumbers = (value) => {
  if (/[0-9]/.test(value)) {
    return true
  } else {
    return "Password must include a number."
  }
}

const noSpace = (value) => {
  if (value.match(/\s/g)) {
    return "Do no include space in your username"
  } else {
    return true
  }
}

const validation = { required, match, minLength, maxLength, includeLetters, includeNumbers, noSpace }

export default validation