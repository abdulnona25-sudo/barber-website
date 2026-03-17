const sections = document.querySelectorAll(".fade");

function reveal() {
    
    const windowHeight = window.innerHeight;

    sections.forEach(section => {
        
        const top = section.getBoundingClientRect().top;

        if(top < windowHeight - 100){

            section.classList.add("show");
        }
    });

}

window.addEventListener("scroll", reveal);
reveal();