let currentIndex = 0;
const slides = document.querySelectorAll(".carousel-slide");
const totalSlides = slides.length;
const carouselContainer = document.querySelector(".carousel-container");
const dots = document.querySelectorAll(".dot");

function showSlide(index) {
    if (index >= totalSlides) currentIndex = 0;
    else if (index < 0) currentIndex = totalSlides - 1;
    else currentIndex = index;

    const translateX = -currentIndex * 100 + "%";
    slides.forEach((slide) => {
        slide.style.transform = `translateX(${translateX})`;
    });
    

    dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === currentIndex);
    });
}

function prevSlide() {
    showSlide(currentIndex - 1);
}

function nextSlide() {
    showSlide(currentIndex + 1);
}

function currentSlide(index) {
    showSlide(index - 1);
}
function viewProduct(productId) {
    window.location.href = `/ProductDetail?product_id=${productId}`;
}

// Initialize the first slide
showSlide(currentIndex);
