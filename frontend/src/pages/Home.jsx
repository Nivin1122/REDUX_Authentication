import React from 'react'
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>Home
      <ul>
            <li><Link to="/profile">My Profile</Link></li>
        </ul>
    </div>
  )
}

export default Home