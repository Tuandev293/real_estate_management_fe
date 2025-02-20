import { FaPlus } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { IoEyeOutline } from "react-icons/io5";
import buildingService from "../services/buildingService";
import { useQuery } from "@tanstack/react-query";
import Loading from "../components/Loading/Loading";
import { useNavigate } from "react-router-dom";
import { MdOutlineNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import { useState, useEffect } from "react";
import { HomePageLocal } from "../locales/locales";
import formatNumber from "../helper/formatNumber";
import { FaArrowDownLong, FaArrowUpLong } from "react-icons/fa6";
import notfound from "../assets/images/notfound.jpg";

function HomePage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [lastPage, setLastPage] = useState(0);
  const [sortOrder, setSortOrder] = useState("");
  const [search, setSearch] = useState("");
  const [totalRoom, setTotalRoom] = useState(0);
  const url = import.meta.env.VITE_APP_URL;

  const handleGetDataBuilding = async () => {
    try {
      const res = await buildingService.getAll(currentPage, sortOrder, search);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const { isLoading, data } = useQuery({
    queryKey: ["buildings", currentPage, sortOrder, search],
    queryFn: () => handleGetDataBuilding(),
    keepPreviousData: true,
  });

  const handleNavigateDetail = (id) => {
    navigate(`/details/${id}`);
  };

  const handleNavigateAdd = () => {
    navigate("/add");
  };

  useEffect(() => {
    if (data) {
      setTotalPages(Math.ceil(data.total / data.per_page));
      setLastPage(data.last_page);
      setTotalRoom(data.total);
    }
  }, [data]);

  const handleNextPage = () => {
    if (currentPage < lastPage) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleSortAsc = () => {
    setSortOrder("asc");
  };

  const handleSortDesc = () => {
    setSortOrder("desc");
  };

  return (
    <div className="container">
      <div className="header">
        <p>{HomePageLocal.title}</p>
        <button className="btn btn-add" onClick={handleNavigateAdd}>
          <FaPlus /> {HomePageLocal.add}
        </button>
      </div>
      <div className="search-box">
        <p>
          {HomePageLocal.room} <span>{totalRoom}</span> 室
        </p>
        <div className="relative">
          <IoIosSearch
            size={20}
            className="absolute top-4 left-2"
            color="#909cb5"
          />
          <input
            type="text"
            placeholder={HomePageLocal.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="outline-none px-7 py-3 rounded-md border border-[#ccc]"
          />
        </div>
      </div>
      <div className="list">
        <div className="header-list">
          <p className="image">{HomePageLocal.image}</p>
          <p className="room">
            {HomePageLocal.room_number} / {HomePageLocal.name} / ID /{" "}
            {HomePageLocal.address}
          </p>
          <div className="price">
            <p>{HomePageLocal.price_title}</p>
            <div className="flex">
              <FaArrowUpLong
                color={sortOrder === "asc" ? "#000" : "#909cb5"}
                className="cursor-pointer"
                onClick={handleSortAsc}
              />
              <FaArrowDownLong
                color={sortOrder === "desc" ? "#000" : "#909cb5"}
                className="cursor-pointer"
                onClick={handleSortDesc}
              />
            </div>
          </div>
          <p className="action">{HomePageLocal.action}</p>
        </div>
        <div
          className="max-h-[640px] overflow-y-auto [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
        >
          {isLoading ? (
            <Loading />
          ) : (
            data &&
            data.data.map((building, index) => (
              <div className="content" key={index}>
                <div className="image">
                  <img
                    src={
                      building.url_image
                        ? `${url}/${building.url_image}`
                        : notfound
                    }
                    alt="Image"
                  />
                </div>
                <div className="room">
                  <p className="room-number">{building.room_number} 号室</p>
                  <p className="name-building">
                    ID: {building.id} | {building.address} |{" "}
                    {building.name_building}
                  </p>
                </div>
                <div className="price">
                  <div>
                    <span className="short">{HomePageLocal.short}</span>
                    <p className="">
                      {formatNumber(building.formatted_price)}
                      {HomePageLocal.price}{" "}
                      <span className="month">/ {HomePageLocal.day}</span>
                    </p>
                  </div>
                  <div>
                    <span className="middle">{HomePageLocal.middle}</span>
                    <p className="">
                      {building.formatted_price}
                      {HomePageLocal.price}{" "}
                      <span className="month">/ {HomePageLocal.month}</span>
                    </p>
                  </div>
                </div>
                <div>
                  <button
                    className="btn btn-detail"
                    onClick={() => handleNavigateDetail(building.id)}
                  >
                    <IoEyeOutline size={20} /> 詳細
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="pagination">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="bg-white border border-gray-300 px-4 py-2 rounded-md cursor-pointer disabled:cursor-not-allowed"
        >
          <GrFormPrevious size={20} />
        </button>
        <p>
          {currentPage} of {totalPages}
        </p>

        <button
          onClick={handleNextPage}
          disabled={currentPage === lastPage}
          className="bg-white border border-gray-300 px-4 py-2 rounded-md cursor-pointer disabled:cursor-not-allowed"
        >
          <MdOutlineNavigateNext size={20} />
        </button>
      </div>
    </div>
  );
}

export default HomePage;
