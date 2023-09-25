import styles from '@/styles/components/input-box.module.scss';
import { UseFormRegister } from 'react-hook-form';
import { AuthSchema } from '@/schemas/auth.schema';
import { ChangeEvent, InputHTMLAttributes } from 'react';

interface InputBindings {
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onInput?: (event: InputHTMLAttributes<HTMLInputElement>) => void;
}

interface Props {
  label: string;
  name: 'email' | 'password';
  error?: boolean;
  errorMessage?: string;
  type: 'text' | 'password';
  disabled?: boolean;
  register: UseFormRegister<AuthSchema>;
  bindings?: InputBindings;
}

export default function InputBox({
  bindings,
  label,
  name,
  error,
  errorMessage,
  type,
  disabled,
  register,
}: Props): JSX.Element {
  return (
    <div className={styles.inputBox}>
      <label className={styles.inputLabel} htmlFor={name}>
        {label}
      </label>
      <input
        {...bindings}
        className={`${styles.input} ${error ? styles.inputError : undefined} ${
          disabled ? styles.disabled : undefined
        }`}
        type={type}
        autoCapitalize="none"
        {...(register && { ...register(name) })}
      />
      {errorMessage && (
        <span className={styles.errorMessage}>{errorMessage}</span>
      )}
    </div>
  );
}
