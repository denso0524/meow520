window.addEventListener('load', function(){
    console.log("All source has loaded");
    setTimeout(function(){
        console.log("wait 0.5 seconds");
        let loading = document.querySelector(".loading");
        loading.classList.add("close");
    }, 500);//wait 2 seconds

    
    /*let container = document.querySelector("...");
    container.style.cssText += `
        ...(animation)
    `*/
})