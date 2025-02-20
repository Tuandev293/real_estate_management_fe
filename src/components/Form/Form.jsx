import { useNavigate, useParams } from "react-router-dom";
import "./form.css";
import buildingService from "../../services/buildingService";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import Modal from "../Modal/Modal";
import { HomePageLocal } from "../../locales/locales.js";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "@material-tailwind/react";
import Loading from "../Loading/Loading";
import { IoCloseCircle } from "react-icons/io5";

const typeImg = ["image/jpeg", "image/jpg", "image/png"];
const schema = yup
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
      .transform((value, originalValue) => {
        if (typeof originalValue === "string") {
          return Number(originalValue.replace(/,/g, ""));
        }
        return value;
      })
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

function Form() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState();
  const fileInputRef = useRef(null);

  const showDeleteModal = () => {
    setIsModalOpen(true);
  };

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name_building: "",
      address: "",
      room_number: "",
      price: "",
      image: null,
    },
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    trigger,
    formState: { errors },
  } = methods;

  const { isLoading, data } = useQuery({
    queryKey: ["detail", id],
    queryFn: async () => {
      try {
        const res = await buildingService.findById(id);
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  useEffect(() => {
    if (data) {
      reset({
        name_building: data.name_building || "",
        address: data.address || "",
        room_number: data.room_number || "",
        price: data.formatted_price || "",
        image: null,
      });
      setPreviewImage(data.url_image || "");
    }
  }, [data, reset]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!typeImg.includes(file.type)) {
        setPreviewImage(null);
        trigger("image");
        return;
      }
      setValue("image", e.target.files);
      const imageURL = URL.createObjectURL(file);
      setPreviewImage(imageURL);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setValue("image", null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (values) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("name_building", values.name_building);
    formData.append("address", values.address);
    formData.append("room_number", values.room_number);
    formData.append("price", values.price);
    if (values.image && values.image.length > 0) {
      formData.append("image", values.image[0]);
    }
    try {
      const req = await buildingService.update(id, formData);
      toast.success(req.message, {
        position: "top-right",
        autoClose: 1000,
      });

      if (req.status === "success") {
        setTimeout(() => {
          navigate("/");
        }, 1100);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBuilding = async () => {
    try {
      const res = await buildingService.delete(id);
      setIsModalOpen(false);
      toast.success(res.message, {
        position: "top-right",
        autoClose: 1000,
      });
      if (res.status === "success") {
        setTimeout(() => {
          navigate("/");
        }, 1100);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <ToastContainer />
      {isLoading ? (
        <Loading />
      ) : (
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label>{HomePageLocal.name}</label>
            <input
              type="text"
              name="name_building"
              placeholder={HomePageLocal.name}
              {...register("name_building")}
              className="mb-2 input-text"
            />
            {errors.name_building && (
              <p className="text-red-500">{errors.name_building.message}</p>
            )}

            <label>{HomePageLocal.address}</label>
            <input
              type="text"
              name="address"
              placeholder={HomePageLocal.address}
              {...register("address")}
              className="mb-2 input-text"
            />
            {errors.address && (
              <p className="text-red-500">{errors.address.message}</p>
            )}

            <label>{HomePageLocal.room_number}</label>
            <input
              type="text"
              name="room_number"
              placeholder={HomePageLocal.room_number}
              {...register("room_number")}
              className="mb-2 input-text"
            />
            {errors.room_number && (
              <p className="text-red-500">{errors.room_number.message}</p>
            )}

            <label>{HomePageLocal.price_title}</label>
            <input
              type="text"
              name="price"
              placeholder={HomePageLocal.price_title}
              {...register("price")}
              className="mb-2 input-text"
            />
            {errors.price && (
              <p className="text-red-500">{errors.price.message}</p>
            )}

            <label>{HomePageLocal.image}</label>
            <input
              type="file"
              className="input-file"
              name="image"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
            />
            {errors.image && (
              <p className="text-red-500 text-sm">{errors.image.message}</p>
            )}

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
              <Button type="submit" color="blue" loading={loading}>
                {HomePageLocal.update}
              </Button>
              <Button type="button" color="red" onClick={showDeleteModal}>
                {HomePageLocal.delete_button}
              </Button>
            </div>
            <Modal
              isModalOpen={isModalOpen}
              handleOk={handleDeleteBuilding}
              handleCancel={() => setIsModalOpen(false)}
            />
          </form>
        </FormProvider>
      )}
    </div>
  );
}

export default Form;
