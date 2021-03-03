import { auth, googleAuthProvider, firestore } from '../lib/firebase';
import { useCallback, useContext, useState, useEffect } from 'react';
import { UserContext } from '../lib/context';
import debounce from 'lodash.debounce';

export default function Enter(props) {
  const { user, username } = useContext(UserContext);
  return (
    <main>
      {user ? (
        !username ? (
          <UsernameForm />
        ) : (
          <SignOutButton />
        )
      ) : (
        <SignInButton />
      )}
    </main>
  );
}

// sign in with google button

const SignInButton = () => {
  const signInWithGoogle = async () => {
    try {
      await auth.signInWithPopup(googleAuthProvider);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className='container mx-auto flex  justify-center h-screen py-24'>
      <div className='w-1/3 h-1/3 p-8 bg-gray-600 flex flex-col justify-center items-center rounded shadow-xl border-b-4 border-red-600'>
        <div className='mb-10'>
          <h2 className='font-bold text-2xl text-white'>Welcome to SladeDev</h2>
        </div>
        <button
          className='py-2 px-4 outline-none rounded bg-red-700 text-xl text-red-100 focus:outline-none'
          onClick={signInWithGoogle}
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};
//sign out button
const SignOutButton = () => {
  return (
    <button
      className='py-2 px-4 outline-none rounded bg-red-700 text-xl text-red-100 focus:outline-none'
      onClick={() => auth.signOut()}
    >
      Sign Out
    </button>
  );
};

// Username form
const UsernameForm = () => {
  const [formValue, setFormValue] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, username } = useContext(UserContext);

  const onSubmit = async (e) => {
    e.preventDefault();

    // Create refs for both documents
    const userDoc = firestore.doc(`users/${user.uid}`);
    const usernameDoc = firestore.doc(`usernames/${formValue}`);

    // Commit both docs together as a batch write.
    const batch = firestore.batch();
    batch.set(userDoc, {
      username: formValue,
      photoURL: user.photoURL,
      displayName: user.displayName,
    });
    batch.set(usernameDoc, { uid: user.uid });

    await batch.commit();
  };

  const onChange = (e) => {
    // Force form value typed in form to match correct format
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // Only set form value if length is < 3 OR it passes regex
    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  //

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  // Hit the database for username match after each debounced change
  // useCallback is required for debounce to work
  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const ref = firestore.doc(`usernames/${username}`);
        const { exists } = await ref.get();
        console.log('Firestore read executed!');
        setIsValid(!exists);
        setLoading(false);
      }
    }, 500),
    []
  );

  return (
    !username && (
      <section className='container mx-auto flex  justify-center h-screen py-24'>
        <div className='w-1/2 h-1/3 p-8 bg-gray-600 flex flex-col justify-start  rounded shadow-xl border-b-4 border-red-600'>
          <h3 className='text-2xl text-white self-center  text-center w-1/2 mb-10'>
            Choose Username
          </h3>
          <div className='  mb-2'>
            <form onSubmit={onSubmit} className='flex space-x-2 w-full'>
              <input
                name='username'
                placeholder='Enter Your Name'
                value={formValue}
                onChange={onChange}
                className='p-1 w-full rounded focus:outline-none'
              />
              <button
                type='submit'
                className='bg-gray-400 text-gray-900 py-1 px-4 text-sm focus:outline-none rounded'
                disabled={!isValid}
              >
                Choose
              </button>
            </form>
          </div>
          <div className='text-lg text-white'>
            <UsernameMessage
              username={formValue}
              isValid={isValid}
              loading={loading}
            />
          </div>
        </div>
      </section>
    )
  );
};

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Checking...</p>;
  } else if (isValid) {
    return <p className='text-green-400'>{username} is available!</p>;
  } else if (username && !isValid) {
    return <p className='text-red-500'>That username is taken!</p>;
  } else {
    return <p></p>;
  }
}
