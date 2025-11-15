import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase.ts';
import bgImage from '../../public/bg-image.png';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('User logged in:', userCredential.user);
        alert('Login successful!');
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('User created:', userCredential.user);
        alert('Account created successfully!');
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        
      }}
    >

      <div className="relative z-10 w-full max-w-md mx-4">
        <div 
          className="rounded-2xl shadow-2xl p-10 border border-white/50"
          style={{
            backdropFilter: 'blur(2px)',
            backgroundColor: 'rgba(255, 255, 255, 0.5)'
          }}
        >
          <h1 className="text-4xl font-light text-center mb-8 text-gray-800">
            {isLogin ? 'Sign In' : 'Create Account'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm text-gray-700 mb-2 font-light">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  className="w-full px-4 py-3 rounded-2xl border-2 text-gray-800 focus:border-blue-300 transition-all"
                  style={{
                    borderColor: 'rgba(209, 213, 219, 0.5)',
                    backgroundColor: 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(5px)'
                  }}
                />
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-700 mb-2 font-light">
                E-Mail Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl border-2 text-gray-800 focus:border-blue-300 transition-all"
                style={{
                  borderColor: 'rgba(209, 213, 219, 0.5)',
                  backgroundColor: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(5px)'
                }}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2 font-light">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-2xl border-2 text-gray-800 focus:outline-none focus:border-blue-300 transition-all"
                style={{
                  borderColor: 'rgba(209, 213, 219, 0.5)',
                  backgroundColor: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(5px)'
                }}
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 py-2 rounded-2xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-30 py-3 rounded-2xl hover:shadow mt-6"
              style={{
                backgroundColor: 'rgba(191, 219, 254, 0.8)'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = 'rgba(191, 219, 254, 1)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(191, 219, 254, 0.8)';
              }}
            >
              {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Create Account')}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-700 font-light text-sm">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setName('');
                setEmail('');
                setPassword('');
              }}
              className="underline hover:text-gray-900 transition-colors"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;