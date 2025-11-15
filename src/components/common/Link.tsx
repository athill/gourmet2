import { Link as ReactRouterLink } from 'react-router-dom';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  className?: string;
  children: React.ReactNode;
}

const Link = ({ children, to, className = 'rvt-link-plain', ...rest }: LinkProps) => {
  // Consider link to be internal if it starts with a protocol (e.g., http://, https://, mailto://, ftp://)
  const isInternalLocation = !to.match(/^[a-zA-Z0-9]+:\/\//);
  if (isInternalLocation) {
    return (
      <ReactRouterLink to={to} className={className} {...rest}>
        {children}
      </ReactRouterLink>
    );
  } else {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" {...rest} className={className}>
        {children}
      </a>
    );
  }
};

Link.displayName = 'Link';


export default Link;
