import "./read.css";
import GridCard from "../components/GridCard";
import { Link, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Context } from "../context/Context";
import axios from "axios";
import Loader from "../components/Loader";

const Read = () => {
  const location = useLocation();
  const state = location.state || {}; // Retrieve the state or default to an empty object
  const id = state.id || ""; // Access the id property from the state

  const [data, setData] = useState({});
  const [sideTop, setSideTop] = useState([]);
  const [sideNews, setSideNews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch main data and side top news
  useEffect(() => {
    const fetchingData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8000/api/news/${id}`
        );
        setData(response.data);

        const top = await axios.get(`http://localhost:8000/api/top-news`);
        setSideTop(top.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchingData();
    }
  }, [id]);

  // Fetch side news when main data changes
  useEffect(() => {
    const fetchingData = async () => {
      if (data.item && data.item.category) {
        try {
          const side = await axios.get(
            `http://localhost:8000/api/news?category=${data.item.category}&limit=5`
          );
          setSideNews(side.data.data.news);
        } catch (err) {
          console.log(err);
        }
      }
    };

    fetchingData();
  }, [data.item]);

  const context = useContext(Context);
  const language = context.langValue.readPage;

  function handleClick(e) {
    const leftArrow = document.querySelector(
      "div.the-news article.current-news .info .slider div.between i.fa-chevron-left"
    );
    const allImgs = document.querySelectorAll(
      "div.the-news article.current-news .info .slider .slide"
    );
    let activeImg = document.querySelector(
      "div.the-news article.current-news .info .slider .slide.active"
    ).dataset.index;

    allImgs.forEach((ele) => {
      ele.classList.remove("active");
    });

    if (e.target === leftArrow) {
      if (activeImg > 0) --activeImg;
      else activeImg = allImgs.length - 1;
    } else {
      if (activeImg < allImgs.length - 1) ++activeImg;
      else activeImg = 0;
    }

    allImgs[activeImg].classList.add("active");
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <main className="center">
        <div className="container">
          <div className="the-news">
            {data.item ? (
              <article className="current-news flex-1">
                <h1>{data.item.headline}</h1>
                <p>{data.item.publishedAt}</p>
                <video
                  src={`http://localhost:8000/video/${data.item.video}`}
                  controls
                  autoPlay
                />
                <div className="info">
                  <p>{data.item.summary}</p>
                  <div className="slider">
                    {data.item.photo.map((photo, index) => (
                      <img
                        key={index}
                        data-index={index}
                        className={`slide ${index === 0 ? "active" : ""}`}
                        src={photo}
                        alt=""
                      />
                    ))}
                    <div className="between">
                      <i
                        onClick={handleClick}
                        className="fa-solid fa-chevron-left"
                      ></i>
                      <i
                        onClick={handleClick}
                        className="fa-solid fa-chevron-right"
                      ></i>
                    </div>
                  </div>
                </div>
              </article>
            ) : (
              <Loader />
            )}

            <article className="sub-news">
              <h1>{language && language.top}</h1>
              <article>
                {sideTop &&
                  sideTop.map((ele, index) => (
                    <Link
                      key={ele._id}
                      to="/read"
                      state={{ id: ele._id }}
                      className="image-hover"
                    >
                      <img alt="" src={ele.photo[0]} />
                      <h4>{ele.headline}</h4>
                    </Link>
                  ))}
              </article>

              <h1>{language && language.more}</h1>
              {sideNews &&
                sideNews.map((ele) => (
                  <div key={ele._id} className="center">
                    <Link
                      to="/read"
                      state={{ id: ele._id }}
                      className="image-hover"
                    >
                      <img alt="" src={ele.photo[0]} />
                    </Link>
                    <Link to="/read" state={{ id: ele._id }}>
                      {ele.headline}
                    </Link>
                  </div>
                ))}
            </article>
          </div>
        </div>
        <GridCard />
      </main>
    </>
  );
};

export default Read;
