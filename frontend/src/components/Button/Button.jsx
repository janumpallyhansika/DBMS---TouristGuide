function Button({
  children,
  variant = 'primary',
  onClick,
  type = 'button',
}) {
  return (
    <button
      type={type}
      className={
        variant === 'primary'
          ? 'primary-button'
          : 'secondary-button'
      }
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;