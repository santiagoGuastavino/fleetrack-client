import styles from '@/styles/components/error-box.module.scss';
import { IError } from '@/interfaces/response.interface';

interface Props {
  message: string;
  errors: IError[];
}

export default function ErrorBox({ message, errors }: Props): JSX.Element {
  return (
    <div className={styles.div}>
      <p className={styles.header}>{message}</p>
      {errors &&
        errors.length &&
        errors.map((error: IError, index: number) => (
          <p key={index}>{Object.values(error.constraints)}</p>
        ))}
    </div>
  );
}
