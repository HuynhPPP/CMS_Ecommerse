import styles from './styles.module.scss';

function InputCustom({
  label,
  isShowLabel = true,
  placeholder,
  type,
  isRequired = false,
  dataOption,
  register,
  isError = false,
}) {
  const { container, labelcls, error } = styles;

  const renderInput = () => {
    switch (type) {
      case 'text':
        return (
          <input
            type={type}
            placeholder={placeholder}
            required={isRequired}
            className={isError ? error : ''}
            {...register}
          />
        );
      case 'email':
        return (
          <input
            type={type}
            placeholder={placeholder}
            required={isRequired}
            className={isError ? error : ''}
            {...register}
          />
        );
      case 'password':
        return (
          <input
            type={type}
            placeholder={placeholder}
            required={isRequired}
            className={isError ? error : ''}
            {...register}
          />
        );
      case 'select':
        return (
          <select
            required={isRequired}
            {...register}
            defaultValue=''
            className={isError ? error : ''}
          >
            <option value='' selected disabled hidden>
              {label}
            </option>
            {dataOption.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        );
      default:
        return (
          <input type='text' placeholder={placeholder} required={isRequired} />
        );
    }
  };

  return (
    <div className={container}>
      {isShowLabel && (
        <label className={labelcls}>
          {label} {isRequired && <span>*</span>}
        </label>
      )}
      {renderInput()}
    </div>
  );
}

export default InputCustom;
