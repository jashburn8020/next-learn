import Link from "next/link";

const linkStyle = {
  marginRight: 15
};

const Header = () => (
  <div>
    {/* Static route */}
    <Link href="/">
      <a style={linkStyle}>Home</a>
    </Link>
    <Link href="/dynamic_routing">
      <a style={linkStyle}>Dynamic Routing</a>
    </Link>
    <Link href="/batman">
      <a style={linkStyle}>Batman</a>
    </Link>
    <Link href="/random_quote">
      <a style={linkStyle}>Random Quote</a>
    </Link>
    <Link href="/about">
      <a style={linkStyle}>About</a>
    </Link>
  </div>
);

export default Header;
