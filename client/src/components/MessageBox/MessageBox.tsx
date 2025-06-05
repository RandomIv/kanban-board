import { ReactNode } from 'react';
import classes from './MessageBox.module.css';

interface Props {
  type?: string;
  children: ReactNode;
}

export default function MessageBox({ type, children }: Props) {
  let color = '#DDDDDD';

  if (type === 'error') {
    color = '#f7a8c4';
  }
  if (type === 'success') {
    color = '#9FC87E';
  }

  return (
    <p className={classes.box} style={{ backgroundColor: color }}>
      {children}
    </p>
  );
}
