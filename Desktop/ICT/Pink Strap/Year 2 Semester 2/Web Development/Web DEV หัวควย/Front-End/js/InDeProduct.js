document.addEventListener("DOMContentLoaded", function () {
    const quantityElement = document.getElementById("quantity");
    const increaseButt = document.getElementById("increase");
    const decreaseButt = document.getElementById("decrease");

    decreaseButt.addEventListener("click", function () {
        let currentValue = parseInt(quantityElement.value);
        if (currentValue > 1) {
            quantityElement.value = currentValue - 1;
        }
    });

    increaseButt.addEventListener("click", function () {
        let currentValue = parseInt(quantityElement.value);
        quantityElement.value = currentValue + 1;
    });
});







document.addEventListener('DOMContentLoaded', function() {
    
    const scrollContainer = document.querySelector('.related-list');
    const scrollLeftBtn = document.getElementById('scrollLeft');
    const scrollRightBtn = document.getElementById('scrollRight');
    
   
    if (scrollLeftBtn && scrollRightBtn && scrollContainer) {
      
      scrollLeftBtn.addEventListener('click', function() {
        scrollContainer.scrollBy({ left: -300, behavior: 'smooth' });
      });
      
      
      scrollRightBtn.addEventListener('click', function() {
        scrollContainer.scrollBy({ left: 300, behavior: 'smooth' });
      });
    }
  });