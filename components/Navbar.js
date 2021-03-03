import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '../lib/context';
export default function Navbar() {
  const { user, username } = useContext(UserContext);

  return (
    <div className='bg-gray-700 p-5'>
      <nav className='container mx-auto '>
        <ul className='flex items-center justify-between'>
          <div>
            <li>
              <Link href='/'>
                <button className='outline-none focus:outline-none font-bold text-white text-xl'>
                  Slade<span className='text-red-600'>Dev</span>
                </button>
              </Link>
            </li>
          </div>
          <div>
            {username && (
              <div className='flex items-center space-x-2'>
                <li>
                  <Link href='/admin'>
                    <button className='py-2 px-4 rounded bg-red-700  text-lg outline-none focus:outline-none font-bold text-red-100'>
                      Write Post
                    </button>
                  </Link>
                </li>
                <li>
                  <Link href={`/${username}`}>
                    <img
                      src={user?.photoURL}
                      className='rounded-full h-11 w-11'
                    />
                  </Link>
                </li>
              </div>
            )}

            {!username && (
              <li>
                <Link href='/enter'>
                  <button className='py-2 px-4 rounded border-2 border-purple-700  text-lg outline-none focus:outline-none font-bold text-white'>
                    Log in
                  </button>
                </Link>
              </li>
            )}
          </div>
        </ul>
      </nav>
    </div>
  );
}
