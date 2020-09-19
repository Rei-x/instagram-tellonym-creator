$(document).ready(function() { 
        
    document.querySelector(".input").addEventListener("input", () => {
        document.querySelector(".content__text").innerHTML =  document.querySelector(".input").value
    })

    document.getElementById("download").addEventListener("click", function() {

        document.querySelector(".container").style.width = "1080px";
        document.querySelector(".container").style.height = "1180px";
        document.querySelector(".container").style.transform = "scale(1)";

        html2canvas(document.querySelector('.container')).then(function(canvas) {
    
            let filename = new Date().getTime();
            saveAs(canvas.toDataURL(), `tellonym${filename}.png`);
        });

        document.querySelector(".container").style.width = "100%";
        document.querySelector(".container").style.height = "90vh";
        document.querySelector(".container").style.transform = "scale(0.9)";
    });
    
    
    function saveAs(uri, filename) {
    
        var link = document.createElement('a');
    
        if (typeof link.download === 'string') {
    
            link.href = uri;
            link.download = filename;
    
            document.body.appendChild(link);
    
            link.click();
    
            document.body.removeChild(link);
    
        } else {
    
            window.open(uri);
    
        }
    }
   
}); 