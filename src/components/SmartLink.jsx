import React from 'react';
import { Link } from 'react-router-dom';

export default function SmartLink({ to = '/', className = '', children, ...rest }) {
  const isExternal = /^(https?:\/\/|mailto:|tel:)/.test(to);
  if (isExternal) {
    return (
      <a href={to} className={className} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link to={to} className={className} {...rest}>
      {children}
    </Link>
  );
}
