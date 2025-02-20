import { Input as InputMui } from "@material-tailwind/react";
import { useController, useFormContext } from "react-hook-form";

const Input = ({
  type = "text",
  placeholder = "Email",
  children = "",
  name,
  valueUpdate,
}) => {
  const { formState, control } = useFormContext();
  const { errors } = formState;
  const { field } = useController({
    name,
    control,
    defaultValue: "",
  });
  return (
    <div className="relative w-full">
      <input
        {...field}
        type={type}
        name={name}
        placeholder={placeholder}
        className={`pl-8 focus:shadow-md ${
          valueUpdate
            ? errors[name]
              ? "border-t-red-500_important"
              : "border-t-gray-900_important border-t-gray-200_important"
            : ""
        } w-full p-3 border border-[#ccc] rounded`}
      />
      <div className="my-2">
        {!!errors[name] && (
          <p className="text-red-500 text-left text-sm">
            {errors[name]?.message}
          </p>
        )}
      </div>
      <div className="absolute top-[9px] px-2">{children}</div>
    </div>
  );
};
export default Input;
