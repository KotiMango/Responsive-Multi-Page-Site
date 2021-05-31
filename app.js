//init function
function init() {
  //Query selecting the interactive navbar
  const slides = document.querySelectorAll(".slide");
  const pages = document.querySelectorAll(".page");

  //Background which are intended to be used for the pros
  const backgrounds = [
    `radial-gradient(#2B3760, #0B1023)`,
    `radial-gradient(#4E3022, #161616)`,
    `radial-gradient(#4E4342, #0B1023)`,
  ];

  //Tracker
  let current = 0;
  let scrollSlide = 0;
  //iterating over all of the slide buttons and its index
  slides.forEach((slide, index) => {
    slide.addEventListener("click", function () {
      changeDots(this);
      nextSlide(index);
      scrollSlide = index;
    });
  });

  //Removes active class from all dots
  //sets active on clicked dot
  function changeDots(dot) {
    slides.forEach((slide) => {
      slide.classList.remove("active");
    });
    dot.classList.add("active");
  }

  function nextSlide(pageNumber) {
    const nextPage = pages[pageNumber];
    const currentPage = pages[current];
    const nextLeft = nextPage.querySelector(".hero .model-left");
    const nextRight = nextPage.querySelector(".hero .model-right");
    const currentLeft = currentPage.querySelector(".hero .model-left");
    const currentRight = currentPage.querySelector(".hero .model-right");
    const nextText = nextPage.querySelector(".details");
    const portfolio = document.querySelector(".portfolio");

    //GSAP TimeLine
    const tl = new TimelineMax({
      onStart: function () {
        slides.forEach((slide) => {
          slide.style.pointerEvents = "none";
        });
      },
      onComplete: function () {
        slides.forEach((slide) => {
          slide.style.pointerEvents = "all";
        });
      },
    });

    tl.fromTo(currentLeft, 0.3, { y: "-10%" }, { y: "-100%" })
      .fromTo(currentRight, 0.3, { y: "10%" }, { y: "-100%" }, "-=0.2")
      .to(portfolio, 0.3, { backgroundImage: backgrounds[pageNumber] })
      .fromTo(
        currentPage,
        0.3,
        { opacity: 1, pointerEvents: "all" },
        { opacity: 0, pointerEvents: "none" }
      )
      .fromTo(
        nextPage,
        0.3,
        { opacity: 0, pointerEvents: "none" },
        { opacity: 1, pointerEvents: "all" },
        "-=0.2"
      )
      .fromTo(nextLeft, 0.3, { y: "-100%" }, { y: -"-10%" }, "-=0.6")
      .fromTo(nextRight, 0.3, { y: "-100%" }, { y: -"-10%" }, "-=0.8")
      .fromTo(nextText, 0.3, { opacity: 0 }, { opacity: 1 })
      //GSAP overrides css translators so props are cleared after action
      .set(nextLeft, { clearProps: "all" })
      .set(nextRight, { clearProps: "all" });
    //Saving the number of the page that we are in
    current = pageNumber;
  }

  //Wheel throttle navigation
  document.addEventListener("wheel", throttle(scrollChange, 1500));
  document.addEventListener("touchmove", throttle(scrollChange, 1500));
  //deltaY indicates scroll direction with 100 being down and vice versa

  function switchDots(dotNumber) {
    const activeDot = document.querySelectorAll(".slide")[dotNumber];
    slides.forEach((slide) => {
      slide.classList.remove("active");
    });
    activeDot.classList.add("active");
  }

  function scrollChange(e) {
    //If scrolling down +1 and vice versa
    if (e.deltaY > 0) {
      scrollSlide += 1;
    } else {
      scrollSlide -= 1;
    }
    //if reached to end teleport to start and vice versa
    if (scrollSlide > 2) {
      scrollSlide = 0;
    }
    if (scrollSlide < 0) {
      scrollSlide = 2;
    }
    switchDots(scrollSlide);
    nextSlide(scrollSlide);
  }
}
//throttle function

function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

init();
