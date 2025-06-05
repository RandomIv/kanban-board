import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import classes from './BoardItem.module.css';

import { deleteBoard } from '@/lib/api/board';

interface Props {
  id: string;
  title: string;
  updatedAt: string;
}

export default function BoardItem({ id, title, updatedAt }: Props) {
  const router = useRouter();

  const date = new Date(updatedAt);
  const formattedDate = date.toLocaleDateString();

  const queryClient = useQueryClient();

  const { mutate: deleteBoardMutate, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteBoard(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userBoards'] });
    },
    onError: (error: unknown) => {
      const err = error as Error;
      alert(`Failed to delete board: ${err.message}`);
    },
  });

  const handleDelete = () => {
    const confirmDelete = confirm(
      'Are you sure you want to delete this board?'
    );
    if (confirmDelete) deleteBoardMutate();
  };

  const handleClick = () => {
    router.push(`/board/${id}`);
  };

  return (
    <div className={classes['board-item']} onClick={handleClick}>
      <h3>{title}</h3>
      <div className={classes['date-box']}>
        <span>{formattedDate}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : <FontAwesomeIcon icon={faTrash} />}
        </button>
      </div>
    </div>
  );
}
