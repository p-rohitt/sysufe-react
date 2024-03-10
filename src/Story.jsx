import React, { useEffect, useState } from "react";
import Popular from "./Popular";
import { AiOutlineSearch } from "react-icons/ai";
import { BiChevronDown } from "react-icons/bi";
import { FiStar } from "react-icons/fi";
import { FiShare2 } from "react-icons/fi";
import { BsPen, BsArrowLeft } from "react-icons/bs";
import { CgArrowsExchangeAltV } from "react-icons/cg";
import { toast } from "react-toastify";
import { useRef } from "react";
import { useParams } from "react-router-dom";
import SwiperCore, { EffectCoverflow } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  formattedDate,
  formattedTime,
  formattedDate2,
  getCurrentDateTime,
} from "./utils/date";

import ShareModal from "./ShareModal";
import database from "./db/db";
import {
  ref,
  push,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

import "swiper/swiper-bundle.css";
import "swiper/components/effect-coverflow/effect-coverflow.min.css";
import "react-toastify/dist/ReactToastify.css";
SwiperCore.use([EffectCoverflow]);

// const List = ref(database, 'List')

const cat = ref(database, "Category");

let initialCategories = [
  "FIGMA",
  "FOOD",
  "ENGINEERING",
  "CINEMA",
  "JOURNALISM",
];

export default function Story() {
  const [subject, setSubject] = useState("");
  const [describe, setDescribe] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [searchResults2, setSearchResults2] = useState([]);

  const [categories, setCategories] = useState([]);
  const [sortedCategories, setSortedCategories] = useState([]);
  const [starredCategories, setStarredCategories] = useState([]); //store starred categories
  const [isStarred, setIsStarred] = useState(false); // to mark if something is starred
  const [newCat, setNewCat] = useState([]);
  const [randomCat, setRandom] = useState([]);
  const [mappable, setMappable] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("");
  const [show, setShow] = useState(false);
  const [show3, setShow3] = useState(false);
  const [show4, setShow4] = useState(false);
  const [menu, setMenu] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [content, setContent] = useState(false);
  const [check, setCheck] = useState("");
  const [selectedValue, setSelectedValue] = useState("");

  const [stories, setStories] = useState(0);
  const [expandedSections, setExpandedSections] = useState({});
  const [reveal, setReveal] = useState({});

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dropdownRef = useRef(null); //references dropdown div
  const { queryCat } = useParams();

  //STYLES
  const revealMain = {
    position: "absolute",
    top: "0px",
    left: windowWidth > 375 ? "-75px" : windowWidth > 320 ? "-90px" : "-80px",
    width: windowWidth > 320 ? "283px" : "40vw",
    height: "40vh",
    boxShadow: "1px 1px 0px #000000",
  };

  const revealhead = {
    alignSelf: "center",
    width: "194px",
    marginBottom: "8px",
  };

  const revealPara = {
    marginTop: "initial",
    width: "215px",
    overflowY: reveal ? "auto" : "hidden",
    maxHeight: "25vh",
    fontSize: "0.625rem",
    padding: "2px",
  };

  //USE_EFFECT HOOKS
  useEffect(() => {
    onValue(cat, function (snapshot) {
      if (snapshot.exists()) {
        const entries = Object.entries(snapshot.val());
        setCategories(entries.map((item) => item[1]));
        setNewCat(entries.map((item) => item[1]));
        setRandom(entries.map((item) => item[1]));
      }
    });
    //fetch categories from database
    onValue(
      ref(database, `Category`, function (snapshot) {
        if (snapshot.exists()) {
          setCategories(Object.entries(snapshot.val()));
          setSortedCategories(Object.entries(snapshot.val()));
        }
      })
    );

    //also look for starred categories in local storage
    async function fetchStarredCategories() {
      const localStorageBool = localStorage.getItem("isStarred");
      if (localStorageBool === "true") {
        const localStorageStarred = localStorage.getItem("starred");
        const starredCat = await JSON.parse(localStorageStarred);
        setStarredCategories(starredCat);
        setIsStarred(true);
        // console.log(starredCat)
      }
    }
    fetchStarredCategories();

    //function to set states to false if anywhere else is clicked
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShow4(false);
        setShow3(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    sortPopular(); // whenever a new category is added or changed, sort them
  }, [categories]);

  useEffect(() => {
    if (randomCat.length > 0) {
      const random = Math.floor(Math.random() * categories.length);
      console.log("quercat:", queryCat);
      if (!queryCat) {
        // if no query param is passed, we set a random category
        setCheck(randomCat[random]);
        setCurrentCategory(randomCat[random]);
      } else {
        // else we check if it is an actual category, if not we set check to none
        console.log(queryCat);
        if (categories.includes(queryCat.toUpperCase())) {
          setCheck(queryCat.toUpperCase());
          setCurrentCategory(queryCat.toUpperCase());
        } else {
          setCheck("");
          setCurrentCategory("");
        }
      }
    }
  }, [randomCat, categories, queryCat]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    windowWidth > 426 ? setContent(true) : setContent(false);
    if (windowWidth > 426) {
      setReveal({});
    } else if (windowWidth <= 426) {
      setShow4(false);
      setShow(false);
    }
  }, [windowWidth]);

  useEffect(() => {
    if (selectedValue) {
      onValue(
        ref(database, `List/${selectedValue.toUpperCase()}`),
        function (snapshot) {
          if (snapshot.exists()) {
            setStories(Object.entries(snapshot.val()).length);
            setMappable(Object.entries(snapshot.val()));
            console.log(mappable);
          } else {
            setStories(0);
            setMappable([]);
          }
        }
      );
    }
    setReveal({});
  }, [selectedValue]);

  useEffect(() => {
    if (check) {
      onValue(
        ref(database, `List/${check.toUpperCase()}`),
        function (snapshot) {
          if (snapshot.exists()) {
            setStories(Object.entries(snapshot.val()).length);
            setMappable(Object.entries(snapshot.val()));
          } else {
            setStories(0);
            setMappable([]);
          }
        }
      );
    }

    setReveal({});
  }, [check]);

  useEffect(() => {
    if (search) {
      onValue(
        ref(database, `List/${search.toUpperCase()}`),
        function (snapshot) {
          if (snapshot.exists()) {
            setStories(Object.entries(snapshot.val()).length);
            setMappable(Object.entries(snapshot.val()));
            console.log(mappable);
          } else {
            setStories(0);
            setMappable([]);
          }
        }
      );
    }
    setReveal({});
  }, [search]);

  //UTIL_FUNCTIONS

  function clear() {
    setSubject("");
    setDescribe("");
    setSearchText("");
    setSelectedCategory("");
  }

  function searchBar(cat) {
    cat && setMenu(true);
    setShow3(false);
    setShow4(false);
  }

  function togglePara(itemId) {
    console.log("Toggling");
    windowWidth > 426
      ? setExpandedSections((prevExpandedSections) => ({
          ...prevExpandedSections,
          [itemId]: !prevExpandedSections[itemId],
        }))
      : setReveal((prevReveal) => ({
          ...prevReveal,
          [itemId]: !prevReveal[itemId],
        }));
  }

  function goback() {
    setReveal({});
  }

  function showContent() {
    setContent((prev) => !prev);
  }

  function paragraph(item) {
    if (item) {
      const words = item[1].split(" ");
      const isExpanded = expandedSections[item[2]];
      const isRevealed = reveal[item[2]];

      if (words.length > 24 && !isExpanded) {
        return (
          <div
            className="item-section"
            key={item[2]}
            style={isRevealed ? revealMain : {}}
          >
            <div className="item-category">
              <h3>{item[0]}</h3>
              <p>{formattedDate(item[4])}</p>
            </div>
            {isRevealed && (
              <BsArrowLeft className="left-arrow" onClick={goback} />
            )}
            <h2 style={isRevealed ? revealhead : {}}>{item[3]}</h2>
            <div className="show-para">
              {isRevealed ? (
                <p style={isRevealed ? revealPara : {}}>
                  {item[1].slice(0, item[1].length)}...
                </p>
              ) : (
                <p>{item[1].slice(0, 154)}...</p>
              )}
            </div>
            {windowWidth > 426 ? (
              <span className="read-more" onClick={() => togglePara([item[2]])}>
                Read more...
              </span>
            ) : (
              !isRevealed && (
                <span
                  className="read-more"
                  onClick={() => togglePara([item[2]])}
                >
                  Read more...
                </span>
              )
            )}
          </div>
        );
      } else {
        return (
          <div
            className="item-section"
            key={item[2]}
            style={isRevealed ? revealMain : {}}
          >
            <div className="item-category">
              <h3>{item[0]}</h3>
              <p>{formattedDate(item[4])}</p>
            </div>
            {isRevealed && (
              <BsArrowLeft className="left-arrow" onClick={goback} />
            )}
            <h2 style={isRevealed ? revealhead : {}}>{item[3]}</h2>
            <div className="show-para">
              <p style={isRevealed ? revealPara : {}}>{item[1]}</p>
            </div>
            {words.length > 24 && windowWidth > 426 ? (
              <span className="read-more" onClick={() => togglePara(item[2])}>
                Read less
              </span>
            ) : (
              words.length > 24 &&
              !isRevealed && (
                <span className="read-more" onClick={() => togglePara(item[2])}>
                  Read more...
                </span>
              )
            )}
          </div>
        );
      }
    }
  }

  function sorted(mappable) {
    const sortedMappable = mappable.sort((a, b) => {
      const dateA = new Date(formattedDate2(Object.values(a[1])[4]));
      const dateB = new Date(formattedDate2(Object.values(b[1])[4]));

      if (dateA < dateB) {
        return flipped ? 1 : -1;
      }

      if (dateA > dateB) {
        return flipped ? -1 : 1;
      }

      const timeA = formattedTime(Object.values(a[1])[4]);
      const timeB = formattedTime(Object.values(b[1])[4]);

      if (timeA < timeB) {
        return flipped ? 1 : -1;
      }
      if (timeA > timeB) {
        return flipped ? -1 : 1;
      }
    });

    return sortedMappable.map((items, index) => {
      const random = Math.random() * 4;
      return (
        <div key={random} className="single-items">
          {paragraph(Object.values(items[1]))}
        </div>
      );
    });
  }
  // function to sort the categories and store them in a decreasing order in a state called "sortedCategories"
  function sortPopular() {
    const sortCat = categories.sort((a, b) => {
      let lengthA = 0;
      let lengthB = 0;
      onValue(ref(database, `List/${a.toUpperCase()}`), function (snapshot) {
        if (snapshot.exists()) {
          lengthA = Object.entries(snapshot.val()).length;
        }
      });
      onValue(ref(database, `List/${b.toUpperCase()}`), function (snapshot) {
        if (snapshot.exists()) {
          lengthB = Object.entries(snapshot.val()).length;
        }
      });

      if (lengthA > lengthB) {
        return -1;
      } else return 1;
    });

    setSortedCategories(sortCat.slice(0, 9));
  }

  //  ALL HANDLERS
  function handleValue(e) {
    const name = e.target.name;
    const value = e.target.value;

    if (name === "subject") {
      setSubject(value);
    } else if (name === "description") {
      setDescribe(value);
    }
  }

  function handleSearch(e) {
    const searchValue = e.target.value;
    setSearchText(searchValue);

    const results = performSearch(searchValue);
    setSearchResults(results);
  }
  function performSearch(searchValue) {
    const filteredCategories =
      categories &&
      categories.filter((category) =>
        category.toLowerCase().startsWith(searchValue.toLowerCase())
      );
    return filteredCategories;
  }

  function performSearch2(searchValue) {
    const filteredCategories =
      randomCat &&
      randomCat.filter((category) =>
        category.toLowerCase().startsWith(searchValue.toLowerCase())
      );

    return filteredCategories;
  }

  function handleSearch2(e) {
    setSearch(e.target.value);
    setMenu(false);
    setShow3(true);

    const results = performSearch2(e.target.value);
    setSearchResults2(results);
  }

  function handleCategorySelect(category) {
    setSelectedCategory(category.toUpperCase());
    setSearchText("");
    setSearchResults([]);
    setShow(false);
    setCurrentCategory(category);
  }

  function handleCategorySelect2(category) {
    setSelectedValue("");
    setSearch(category);
    setSearchResults2([]);
    searchBar(category);
    setCurrentCategory(category);
  }

  function handleSubmit(e) {
    const random = Math.random() * 4;
    e.preventDefault();
    const Data = {
      subject: subject,
      description: describe,
      category: selectedCategory,
      timeStamp: getCurrentDateTime(),
      id: random,
    };

    if (subject && describe && selectedCategory) {
      push(ref(database, `List/${selectedCategory}`), Data);

      if (selectedCategory) {
        if (
          newCat &&
          !newCat.some(
            (item) => item.toLowerCase() === selectedCategory.toLowerCase()
          )
        ) {
          push(cat, selectedCategory);
        }
        clear();
      }
      toast.success("Story Published!");
      sortPopular(); // sort whenever a new story is posted successfully.
    }

    // setContent(false)
  }

  function handleShow() {
    setShow((prev) => !prev);
  }

  function handleAdd() {
    setSelectedCategory(searchText.toUpperCase());
    setSearchText("");
    setSearchResults([]);
    setShow(false);

    if (searchText) {
      if (
        initialCategories &&
        !initialCategories.some(
          (item) => item.toLowerCase() === searchText.toLowerCase()
        )
      ) {
        setCategories((prevCategories) => [...prevCategories, searchText]);
        initialCategories.push(searchText);
      }
    }
  }

  function handleClick() {
    setShow3((prev) => !prev);
    setShow4(false);
  }

  function handleClick2() {
    setShow4((prev) => !prev);
    setShow3(false);
  }

  function handleflip() {
    setFlipped((prev) => !prev);
  }

  function handleChildValue(value) {
    setCurrentCategory(value);
    setSelectedValue(value);
    setSearch("");
  }

  // on clicking a starred icon
  function handleStarredIcon() {
    const index = starredCategories.indexOf(currentCategory);  // the index of current category
    if (index !== -1) {
      const modifiedArray = [...starredCategories];
      modifiedArray.splice(index, 1);
      setStarredCategories(modifiedArray);
      localStorage.setItem("starred", JSON.stringify(modifiedArray));
      if (modifiedArray.length === 0) {    // if it is the last starred category, we set flag to false
        localStorage.setItem("isStarred", "false");
        setIsStarred(false);
      }
    }
  }
  // star the category
  function handleNotStarredIcon() {
    const modifiedArray = [...starredCategories, currentCategory];
    setStarredCategories(modifiedArray);
    setIsStarred(true);
    localStorage.setItem("isStarred", "true");
    localStorage.setItem("starred", JSON.stringify(modifiedArray));
  }

  return (
    <div className="flex">
      <Popular
        onChildValue={handleChildValue}
        sortedCategories={sortedCategories}
        starredCategories={starredCategories}
        currentCategory={currentCategory}
        isStarred={isStarred}
      />

      <div className="story-section">
        <form className="section-1">
          <div className="section-1-head">
            <h1>Write your own story</h1>
            <BsPen className="pen" onClick={showContent} />
          </div>
          <div
            className={
              content ? "section-1-content-hidden" : "section-1-content"
            }
          >
            <div className="subject">
              <label htmlFor="subject">
                <h3>Topic</h3>
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                placeholder="write the topic for your story "
                value={subject}
                onChange={(e) => handleValue(e)}
                required
              />
            </div>

            <div className="description">
              <label htmlFor="describe">
                <h3>Description</h3>
              </label>
              <textarea
                value={describe}
                name="description"
                id="describe"
                placeholder="write what your story is about here"
                onChange={(e) => handleValue(e)}
                required
              />
            </div>

            <div className="selectCategory">
              <div className="select-btn" onClick={handleShow}>
                {selectedCategory ? (
                  <span>{selectedCategory.toUpperCase()}</span>
                ) : (
                  <span>Select a category</span>
                )}
                <BiChevronDown className="down" />
              </div>

              {show && (
                <div className="content">
                  <div className="search">
                    <AiOutlineSearch className="search-btn" />
                    <input
                      type="text"
                      id="category"
                      placeholder="Search"
                      value={searchText}
                      onChange={handleSearch}
                      required
                    />
                  </div>

                  {searchText.length === 0 ? (
                    <ul className="search-list">
                      {categories?.map((category) => (
                        <li
                          key={category}
                          onClick={() => handleCategorySelect(category)}
                        >
                          {category}
                        </li>
                      ))}
                    </ul>
                  ) : searchResults.length > 0 ? (
                    <ul className="search-list">
                      {searchResults.map((category) => (
                        <li
                          key={category}
                          onClick={() => handleCategorySelect(category)}
                        >
                          {category}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <ul className="search-list">
                      <li onClick={handleAdd}>Add new category</li>
                    </ul>
                  )}
                </div>
              )}
            </div>

            <button type="submit" className="submit-btn" onClick={handleSubmit}>
              PUBLISH YOUR STORY
            </button>
          </div>
        </form>

        <div className="middle-line" />

        <section className="section-2">
          <div className="section-2-head">
            <h1>
              Read stories on{" "}
              <span className="current-story">{currentCategory}</span>
            </h1>

            <div className="looking" ref={dropdownRef}>
              <div className="choose">
                <label htmlFor="choose">
                  <h3>What are you looking for?</h3>
                </label>
                <input
                  type="text"
                  id="choose"
                  placeholder="Browse a Category"
                  value={search}
                  onClick={handleClick}
                  onChange={handleSearch2}
                  required
                />
                <BiChevronDown className="btn-2" onClick={handleClick2} />
              </div>

              {show4 ? (
                <ul className="search-list search-list-2">
                  {categories?.map((category) => (
                    <li
                      key={category}
                      onClick={() => handleCategorySelect2(category)}
                    >
                      {category}
                    </li>
                  ))}
                </ul>
              ) : show3 && search.length === 0 ? (
                <ul className="search-list search-list-2">
                  {categories?.map((category) => (
                    <li
                      key={category}
                      onClick={() => handleCategorySelect2(category)}
                    >
                      {category}
                    </li>
                  ))}
                </ul>
              ) : (
                show3 &&
                searchResults2.length > 0 && (
                  <ul className="search-list search-list-2">
                    {searchResults2.map((category) => (
                      <li
                        key={category}
                        onClick={() => handleCategorySelect2(category)}
                      >
                        {category}
                      </li>
                    ))}
                  </ul>
                )
              )}
            </div>
          </div>

          <div className="filter">
            <h1 className="total-story">
              <span>
                {stories === 1
                  ? `${stories} story`
                  : stories === 0
                  ? `0 story`
                  : `${stories} stories`}
              </span>{" "}
              for you to read
            </h1>
            <div className="flex-filter">
              <FiShare2
                className="share-icon"
                onClick={() => setIsModalOpen(true)}
              />
              {isModalOpen && (
                <ShareModal
                  setIsModalOpen={setIsModalOpen}
                  currentCategory={currentCategory}
                />
              )}
              {starredCategories.includes(currentCategory) ? (
                <FiStar
                  className="star-icon-starred "
                  onClick={handleStarredIcon}
                />
              ) : (
                <FiStar className="star-icon" onClick={handleNotStarredIcon} />
              )}
              <div className="filter-sort">
                <h2 className="filter-heading">
                  Sort:
                  <span onClick={handleflip}>
                    {flipped ? `Newest to Oldest` : `Oldest to Newest`}
                  </span>
                </h2>
                <CgArrowsExchangeAltV
                  className="filterarrow"
                  onClick={handleflip}
                />
              </div>
            </div>
          </div>

          {windowWidth > 426 ? (
            <div>
              {selectedValue && (
                <div className="container">
                  <section className="item-section-main">
                    <div className="item-section-container">
                      {check && mappable.length > 0 ? (
                        sorted(mappable)
                      ) : (
                        <p className="filter-heading">No stories to show.</p>
                      )}
                    </div>
                  </section>
                </div>
              )}

              {(!menu || search.length === 0) && (
                <div className="container">
                  <section className="item-section-main">
                    <div className="item-section-container">
                      {check && mappable.length > 0 ? (
                        sorted(mappable)
                      ) : (
                        <p className="filter-heading">No stories to show.</p>
                      )}
                    </div>
                  </section>
                </div>
              )}

              {search.length > 0 && menu && (
                <div className="container">
                  <section className="item-section-main">
                    <div className="item-section-container">
                      {mappable.length > 0 ? (
                        sorted(mappable)
                      ) : (
                        <p className="filter-heading">No stories to show.</p>
                      )}
                    </div>
                  </section>
                </div>
              )}
            </div>
          ) : (
            //mobile section
            <div className="container">
              <section className="item-section-main">
                <Swiper
                  effect="coverflow"
                  // grabCursor='true'
                  centeredSlides="true"
                  slidesPerView={3}
                  coverflowEffect={{
                    rotate: 0,
                    stretch: 0,
                    depth: 200,
                    modifier: 1,
                    slideShadows: false,
                  }}
                  // onSwiper={handleSwiperInit}
                  // onSlideChange={handleSlideChange}
                >
                  <div className="swiper-wrapper">
                    {(() => {
                      const sortedMappable = mappable.sort((a, b) => {
                        const dateA = new Date(
                          formattedDate2(Object.values(a[1])[4])
                        );
                        const dateB = new Date(
                          formattedDate2(Object.values(b[1])[4])
                        );

                        if (dateA < dateB) {
                          return flipped ? 1 : -1;
                        }

                        if (dateA > dateB) {
                          return flipped ? -1 : 1;
                        }

                        const timeA = formattedTime(Object.values(a[1])[4]);
                        const timeB = formattedTime(Object.values(b[1])[4]);

                        if (timeA < timeB) {
                          return flipped ? 1 : -1;
                        }
                        if (timeA > timeB) {
                          return flipped ? -1 : 1;
                        }
                      });

                      return sortedMappable.map((items, index) => {
                        const random = Math.random() * 4;
                        return (
                          <SwiperSlide key={random} className="swiper-slide">
                            {paragraph(Object.values(items[1]))}
                          </SwiperSlide>
                        );
                      });
                    })()}
                  </div>
                </Swiper>
              </section>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
