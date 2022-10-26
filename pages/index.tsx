import { useUser } from '@auth0/nextjs-auth0';
import { Navbar, Text, Link } from "@nextui-org/react";
import { Layout } from '../components/Layout';

export default function Home() {
  const { user, isLoading } = useUser()

  return (
    <Layout>
      <Navbar isBordered variant="sticky" isCompact={true}>
        <Navbar.Brand>
          <Navbar.Toggle aria-label="toggle navigation" />
          <Text b color="inherit" hideIn="xs">
            Eve Warehouse
          </Text>
        </Navbar.Brand>
        <Navbar.Content hideIn="xs" variant="underline">
          <Navbar.Link href="#">Characters</Navbar.Link>
        </Navbar.Content>
        <Navbar.Content>
          {!isLoading && !user && (
            <Navbar.Link color="inherit" href="/api/auth/login">
              Login
            </Navbar.Link>
          )}

          {user && (
            <Navbar.Link color="inherit" href="/api/auth/logout">
              Logout
            </Navbar.Link>
          )}
        </Navbar.Content>
        <Navbar.Collapse>
          <Navbar.CollapseItem>
            <Link
              color="inherit"
              css={{
                minWidth: "100%",
              }}
              href="#"
            >
              Characters
            </Link>
          </Navbar.CollapseItem>
        </Navbar.Collapse>
      </Navbar>
      {isLoading && <p>Loading login info...</p>}

      {user && (
        <>
          <h4>Rendered user info on the client</h4>
          {user.picture && <img src={user.picture} alt="user picture" />}
          <p>nickname: {user.nickname}</p>
          <p>name: {user.name}</p>
        </>
      )}

    </Layout>
  )
}
