const toggleLink = document.getElementById('toggle-link');
const formTitle = document.getElementById('form-title');
const fullnameField = document.getElementById('fullname-field');
const submitBtn = document.getElementById('submit-btn');
const authForm = document.getElementById('auth-form');
const serverMessage = document.getElementById('server-message');
const passwordInput = document.getElementById('password');
const passwordMessage = document.getElementById('password-message');

let isSignup = false;

// Toggle Login/Signup view
toggleLink.addEventListener('click', () => {
  isSignup = !isSignup;
  formTitle.textContent = isSignup ? 'Sign Up' : 'Login';
  fullnameField.classList.toggle('hidden', !isSignup);
  submitBtn.textContent = isSignup ? 'Sign Up' : 'Login';
  toggleLink.textContent = isSignup ? 'Login' : 'Sign up';
  serverMessage.textContent = '';
});

// Password strength check
passwordInput.addEventListener('input', () => {
  const pass = passwordInput.value;
  const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
  passwordMessage.textContent = strongPassword.test(pass)
    ? ''
    : 'Password must include uppercase, lowercase, number, special character';
});

// Form submit handler
authForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fullName = document.getElementById('fullName')?.value;
  const email = document.getElementById('email').value;
  const password = passwordInput.value;

  const url = isSignup ? '/api/auth/signup' : '/api/auth/login';
  const payload = isSignup ? { fullName, email, password } : { email, password };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (res.ok) {
      // Save JWT and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.userData));

      const userName = isSignup ? fullName : data.userData?.fullName || 'User';
      serverMessage.textContent = `Welcome ${userName} to Web Mart!`;

      setTimeout(() => {
        window.location.href = '/postfeed.html';
      }, 1500);
    } else {
      serverMessage.textContent = data.errors?.[0]?.msg || 'Something went wrong';
    }
  } catch (err) {
    console.error(err);
    serverMessage.textContent = 'Server error. Please try again later.';
  }
});
