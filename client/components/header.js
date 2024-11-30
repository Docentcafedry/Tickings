import Link from "next/link";

export default function CustomHeader({ data }) {
  console.log(data);
  const links = [
    !data?.email && { name: "Sign Up", href: "/signup" },
    !data?.email && { name: "Sign in", href: "/signin" },
    data?.email && { name: "Sign out", href: "/signout" },
  ].filter((link) => link);
  return (
    <header className="">
      <nav class="navbar navbar-expand-lg navbar-light bg-body-tertiary d-flex justify-content-between">
        <div className="d-flex justify-content-star">
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
