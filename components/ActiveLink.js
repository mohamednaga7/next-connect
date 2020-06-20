import {withRouter} from 'next/router';

const ActiveLink = ({router, href, children}) => {
  const handleClick = (event) => {
    event.preventDefault();
    router.push(href)
  };

  (function prefetchPages() {
    if (typeof window !== "undefined") {
      router.prefetch(router.pathname);
    }
  })()

  const isCurrentPath = router.pathname === href || router.asPath === href;

  return <div>
    <a href={href} onClick={handleClick} style={{
      textDecoration: 'none',
      margin: 0,
      padding: 0,
      fontWeight: isCurrentPath ? 'bold' : 'normal',
      color: isCurrentPath ? '#c62828' : '#ffffff'
    }}>
      {children}
    </a>
  </div>;
};

export default withRouter(ActiveLink);
