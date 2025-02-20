import { useNavigate, useParams } from "react-router-dom";
import "./form.css";
import buildingService from "../../Services/buildingService";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import Modal from "../Modal/Modal";
import { HomePageLocal } from "../../locales/locales.js";

function Form() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dataUpdate, setDataUpdate] = useState({
    name_building: "",
    address: "",
    room_number: "",
    price: "",
    url_image: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showDeleteModal = () => {
    setIsModalOpen(true);
  };

  const [previewImage, setPreviewImage] = useState(null);

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
      setDataUpdate({
        name_building: data.name_building || "",
        address: data.address || "",
        room_number: data.room_number || "",
        price: data.formatted_price || "",
        url_image: data.url_image || "",
      });

      setPreviewImage(data.url_image || "");
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataUpdate((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setDataUpdate((prevData) => ({
        ...prevData,
        url_image: file,
      }));

      const imageURL = URL.createObjectURL(file);
      setPreviewImage(imageURL);
    }
  };

  useEffect(() => {
    return () => {
      if (previewImage && previewImage.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const handleUpdateBuilding = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name_building", dataUpdate.name_building);
      formData.append("address", dataUpdate.address);
      formData.append("room_number", dataUpdate.room_number);
      formData.append("price", dataUpdate.price);

      if (dataUpdate.url_image instanceof File) {
        formData.append("image", dataUpdate.url_image);
      }

      const req = await buildingService.update(id, formData);
      toast.success(req.message, {
        position: "top-right",
        autoClose: 1000,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteBuilding = async () => {
    try {
      const res = await buildingService.delete(id);
      toast.success(res.message, {
        position: "top-right",
        autoClose: 1000,
      });

      if (res.status == "success") {
        navigate("/");
      }

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
        <p>Loading...</p>
      ) : (
        <form>
          <label>{HomePageLocal.name}</label>
          <input
            type="text"
            name="name_building"
            placeholder={HomePageLocal.name}
            value={dataUpdate.name_building}
            onChange={handleChange}
            className="mb-2 input-text"
          />

          <label>{HomePageLocal.address}</label>
          <input
            type="text"
            name="address"
            placeholder={HomePageLocal.address}
            value={dataUpdate.address}
            onChange={handleChange}
            className="mb-2 input-text"
          />

          <label>{HomePageLocal.room_number}</label>
          <input
            type="text"
            name="room_number"
            placeholder={HomePageLocal.room_number}
            value={dataUpdate.room_number}
            onChange={handleChange}
            className="mb-2 input-text"
          />

          <label>{HomePageLocal.price_title}</label>
          <input
            type="text"
            name="price"
            placeholder={HomePageLocal.price_title}
            value={dataUpdate.price}
            onChange={handleChange}
            className="mb-2 input-text"
          />

          <label>{HomePageLocal.image}</label>
          <input
            type="file"
            className="input-file"
            accept="image/*"
            onChange={handleFileChange}
          />
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="mt-2 w-[300px] h-[150px] object-cover"
            />
          )}

          <div className="btn-box">
            <button
              className="btn-update bg-blue-600"
              type="button"
              onClick={handleUpdateBuilding}
            >
              {HomePageLocal.update}
            </button>
            <button
              className="btn-delete bg-red-600"
              type="button"
              onClick={showDeleteModal}
            >
              {HomePageLocal.delete_button}
            </button>
          </div>
          <Modal
            isModalOpen={isModalOpen}
            handleOk={handleDeleteBuilding}
            handleCancel={() => setIsModalOpen(false)}
          />
        </form>
      )}
    </div>
  );
}

export default Form;
