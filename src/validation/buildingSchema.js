// src/validation/buildingSchema.js
import * as yup from "yup";

const typeImg = ["image/jpeg", "image/jpg", "image/png"];

const buildingSchema = yup
  .object({
    name_building: yup.string().required("Name is required"),
    address: yup.string().required("Address is required"),
    room_number: yup
      .number()
      .typeError("Room Number must be a number")
      .required("Room number is required")
      .test("is-integer", "Room Number must be an integer", (value) =>
        Number.isInteger(value)
      ),
    price: yup
      .number()
      .typeError("Price must be a number")
      .required("Price is required")
      .test("is-integer", "Price must be an integer", (value) =>
        Number.isInteger(value)
      ),
    image: yup
      .mixed()
      .nullable()
      .test("fileType", "Only image files are allowed", (value) => {
        if (!value) return true;
        if (value instanceof FileList) {
          return (
            value.length === 0 ||
            (value[0] instanceof File && typeImg.includes(value[0].type))
          );
        }
        return value instanceof File && typeImg.includes(value.type);
      }),
  })
  .required();

export default buildingSchema;
