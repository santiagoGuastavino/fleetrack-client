import styles from '@/styles/components/button.module.scss';

interface Props {
  disabled: boolean;
  label: string;
  type: 'submit' | 'button' | 'reset';
  onClick?: () => void;
}

export default function Button({ disabled, label, type }: Props): JSX.Element {
  return (
    <button
      className={`${styles.button} ${!disabled ? styles.enabled : undefined}`}
      type={type}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
