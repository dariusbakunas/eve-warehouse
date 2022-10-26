import { useUser } from '@auth0/nextjs-auth0';

export default function Home() {
  const { user, isLoading } = useUser()

  return (
    <>
      {isLoading && <p>Loading login info...</p>}
      {user && (
        <>
          <p>nickname: {user.nickname}</p>
          <p>name: {user.name}</p>
        </>
      )}
    </>
  )
}
