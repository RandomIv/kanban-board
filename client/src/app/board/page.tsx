import List from '@/components/List/List';

import classes from './page.module.css';

export default function BoardPage() {
  return (
    <div className={classes['bg-fill']}>
      <div className={classes['board']}>
        <List color="#31363F" title="Backlog" />
        <List color="#FF9F00" title="In Progress" />
        <List color="#F4631E" title="Validate" />
        <List color="#309898" title="Complete" />
      </div>
    </div>
  );
}
