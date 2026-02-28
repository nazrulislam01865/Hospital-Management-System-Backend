import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

function isRealDate(value: string): boolean {
  if (typeof value !== 'string') {
    return false;
  }

  const normalizedValue = value.trim().replace(/\//g, '-');

  let day = 0;
  let month = 0;
  let year = 0;

  if (/^\d{4}-\d{2}-\d{2}$/.test(normalizedValue)) {
    const [parsedYear, parsedMonth, parsedDay] = normalizedValue
      .split('-')
      .map(Number);
    year = parsedYear;
    month = parsedMonth;
    day = parsedDay;
  } else if (/^\d{2}-\d{2}-\d{4}$/.test(normalizedValue)) {
    const [parsedDay, parsedMonth, parsedYear] = normalizedValue
      .split('-')
      .map(Number);
    day = parsedDay;
    month = parsedMonth;
    year = parsedYear;
  } else {
    return false;
  }

  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export function IsValidDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsValidDate',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          if (value === undefined || value === null || value === '') {
            return true;
          }

          return isRealDate(String(value));
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid date`;
        },
      },
    });
  };
}