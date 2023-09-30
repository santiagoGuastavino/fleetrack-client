import styles from '@/styles/components/error-box.module.scss';
import { IError } from '@/interfaces/response.interface';

interface Props {
  errors: IError[];
}

export default function ErrorBox({ errors }: Props): JSX.Element {
  const errorMessage: string = Object.values(errors[0].constraints)[0];
  const errorMessages: string[] = errorMessage.split(/(?<=\.) /);

  return (
    <div className={styles.div}>
      {errorMessages &&
        errorMessages.length &&
        errorMessages.map((error: string, index: number) => (
          <p key={index}>{error}</p>
        ))}
    </div>
  );
}
