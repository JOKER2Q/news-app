import React, { useContext, useEffect, useState } from "react";
import "./news.css";
import axios from "axios";
import { Context } from "../../../context/Context";

const User = () => {
  const [data, setData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const context = useContext(Context);
  const language = context.langValue;
  const token = context.userDetails.token;

  function fetchUsers() {
    axios
      .get("http://localhost:8000/api/users", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => setData(res.data))
      .catch((error) => console.error("Error fetching data:", error));
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setSearchData(data);
  }, [data]);

  const handleSearch = (e) => {
    const inpValue = e.target.value.toLowerCase();
    if (inpValue === "") {
      setSearchData(data);
    } else {
      const filteredData = data.filter(
        (item) =>
          item.username.toLowerCase().includes(inpValue) ||
          item.roles[0].toLowerCase().includes(inpValue)
      );
      setSearchData(filteredData);
    }
  };

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setOverlayVisible(true);
  };

  const handleConfirmDelete = () => {
    axios.delete(`http://localhost:8000/api/users/${selectedItem._id}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    fetchUsers();
    setOverlayVisible(false);
  };

  const handleCancelDelete = () => {
    setOverlayVisible(false);
    setSelectedItem(null);
  };
  document.body.addEventListener("click", (e) => {
    const overlay = document.querySelector("div.main > div.overlay");
    if (e.target === overlay) {
      setOverlayVisible(false);
      setSelectedItem(null);
    } else return false;
  });
  const tableData = searchData.map((item, index) => (
    <tr key={item._id}>
      <td>{index + 1}</td>
      <td className="align-left">{item.username}</td>
      <td>{item.roles}</td>
      <td>
        <span
          data-content={language.dashboard.table.delete}
          onClick={() => handleDeleteClick(item)}
        >
          <i className="fa-solid fa-trash"></i>
        </span>
      </td>
    </tr>
  ));

  return (
    <div className="main">
      {overlayVisible && (
        <div className="overlay">
          <div className="content">
            <h3>{language && language.dashboard.table.deleteMsg}</h3>
            <div className="center">
              <span className="flex-1 cancel" onClick={handleCancelDelete}>
                {language && language.dashboard.table.cencel}
              </span>
              <span className="flex-1 delete" onClick={handleConfirmDelete}>
                <i className="fa-solid fa-trash"></i>
                {language && language.dashboard.table.delete}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-container">
        <article className="search no-wrap">
          <input
            onChange={handleSearch}
            type="text"
            placeholder={language && language.dashboard.table.search}
            className="flex-1"
          />
          <i className="fa-solid fa-magnifying-glass"></i>
        </article>

        <div className="table">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>{language && language.dashboard.table.user}</th>
                <th>{language && language.dashboard.table.role}</th>
                <th>{language && language.dashboard.table.action}</th>
              </tr>
            </thead>
            <tbody>{tableData}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default User;
