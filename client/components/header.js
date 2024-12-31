import Link from "next/link";

export default function CustomHeader({ currentUser }) {
  const links = [
    !currentUser?.email && { name: "Sign Up", href: "/client/auth/signup" },
    !currentUser?.email && { name: "Sign in", href: "/client/auth/signin" },
    currentUser?.email && { name: "Sign out", href: "/client/auth/signout" },
  ].filter((link) => link);
  return (
    <header className="">
      <nav class="navbar navbar-expand-lg navbar-light bg-light d-flex justify-content-between ml-1 p-3">
        <div className="d-flex justify-content-star px-3">
          <Link className="nav-link" href="/">
            Tickings
          </Link>
        </div>
        <div className="flex align-items-center">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {links.map((link) => {
              return (
                <li className="nav-item">
                  <Link key={link.href} className="nav-link" href={link.href}>
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </header>
  );
}
