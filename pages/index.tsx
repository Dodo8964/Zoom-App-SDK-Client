// pages/index.tsx
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  return (
    <div style={{ margin: '50px', textAlign: 'center' }}>
      <h1>Client Login</h1>
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => router.push('/login')} style={{ marginRight: '10px' }}>
          Login
        </button>
        <button onClick={() => router.push('/register')}>Register</button>
      </div>
    </div>
  );
}
