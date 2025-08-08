import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="glass-effect border-0 shadow-sm" style={{ 
      borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
      padding: '1rem 0'
    }}>
      <div className="container-fluid" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="d-flex justify-content-between align-items-center px-4">
          <Link href="/" className="text-decoration-none">
            <h1 className="gradient-text mb-0" style={{ 
              fontFamily: 'var(--font-playfair)', 
              fontSize: '1.8rem',
              fontWeight: '700'
            }}>
              MoneyChain
            </h1>
          </Link>
          <div className="d-flex gap-4">
            <Link href="/" className="text-decoration-none premium-text" style={{ 
              color: 'var(--foreground)',
              fontSize: '0.95rem',
              transition: 'color 0.3s ease'
            }}>
              Dashboard
            </Link>
            <Link href="/transactions" className="text-decoration-none premium-text" style={{ 
              color: 'var(--foreground)',
              fontSize: '0.95rem',
              transition: 'color 0.3s ease'
            }}>
              Transactions
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
