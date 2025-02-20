import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import buildingService from "../services/buildingService";
import Input from "../components/Form/Input";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "@material-tailwind/react";
import { HomePageLocal } from "../locales/locales";
import { IoCloseCircle } from "react-icons/io5";

const typeImg = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];
const schema = yup.object({
  name_building: yup.string().required("Name is required"),
  address: yup.string().required("Address is required"),
  room_number: yup
    .number()
    .typeError("Room Number must be a number type")
    .required("Room number is required")
    .test("is-integer", "Room Number must be an integer", (value) =>
      Number.isInteger(value)
    ),
  price: yup
    .number()
    .typeError("Price must be a number type")
    .required("Price is required")
    .test("is-integer", "Price must be an integer", (value) =>
      Number.isInteger(value)
    ),
  image: yup
    .mixed()
    .nullable()
    .test("fileType", "Only image files are allowed", (value) => {
      if (!value.length) return true;
      return value?.[0] instanceof File && typeImg.includes(value?.[0]?.type);
    }),
});
function AddPage() {
  const [previewImage, setPreviewImage] = useState(null);
  const [image, setImage] = useState(null);
  const methods = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const [loading, setLoading] = useState();

  const {
    handleSubmit,
    register,
    trigger,
    reset,
    setValue,
    formState: { errors },
  } = methods;
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!typeImg.includes(file.type)) {
      trigger("image");
      return;
    }
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setImage(null);
    setValue("image", null);
  };

  const handleCreateBuilding = async (value) => {
    setLoading(true);
    const { name_building, address, room_number, price } = value;
    const formData = new FormData();
    formData.append("name_building", name_building);
    formData.append("address", address);
    formData.append("room_number", room_number);
    formData.append("price", price);
    if (image) {
      formData.append("image", image);
    }
    try {
      const res = await buildingService.create(formData);
      toast.success(res.message);
      reset();
      setPreviewImage(null);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <ToastContainer />
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleCreateBuilding)}>
          <label className="mt">{HomePageLocal.name}</label>
          <Input
            type="text"
            name="name_building"
            placeholder={HomePageLocal.name}
            value={name}
          />

          <label className="mt">{HomePageLocal.address}</label>
          <Input
            type="text"
            name="address"
            placeholder={HomePageLocal.address}
          />

          <label className="mt">{HomePageLocal.room_number}</label>
          <Input
            type="text"
            name="room_number"
            placeholder={HomePageLocal.room_number}
          />

          <label className="mt">{HomePageLocal.price_title}</label>
          <Input
            type="text"
            name="price"
            placeholder={HomePageLocal.price_title}
          />

          <label className="mt">{HomePageLocal.image}</label>
          <input
            type="file"
            name="image"
            {...register("image")}
            accept="image/*"
            onChange={handleFileChange}
          />
          <div className="my-2">
            {!!errors["image"] && (
              <p className="text-red-500 text-left text-sm">
                {errors["image"]?.message}
              </p>
            )}
          </div>
          {previewImage && (
            <div className="relative">
              <IoCloseCircle
                size={24}
                className="absolute left-[276px] top-1 cursor-pointer"
                onClick={handleRemoveImage}
              />
              <img
                src={previewImage}
                alt="Preview"
                className="mt-2 w-[300px] h-[150px] object-cover"
              />
            </div>
          )}
          <div className="btn-box">
            <Button loading={loading} type="submit" color="blue">
              {HomePageLocal.add}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

export default AddPage;
