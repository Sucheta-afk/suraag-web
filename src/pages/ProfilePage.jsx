import React from 'react';
import { useApp } from '../context/AppContext';
import PublicArtistPage from './PublicArtistPage';

export default function ProfilePage() {
  const { viewedUser } = useApp();
  return <PublicArtistPage artist={viewedUser} />;
}
