(function ( $ ) {
    const dict = {
        "imageCreationError":{
          cs: "Nemohu vytvořit obraz",
          en: "Cannot create image"
        },
        "focal distance":{
          cs: "Ohnisková vzdálenost",
          en: "Focal distance"
        }
    };
    
    // $(selector).translate(lang)
    $.fn.translate = function(lang) {
        switch(lang){
            case "en-US":
                lang = "en";
                break;
        }
    
        this.each((i, el) => {
            el = $(el);
            const trn = el.attr("data-trn");
            
            if(trn in dict){
                if(lang in dict[trn]){
                    el.text(dict[trn][lang]);
                }else{
                    el.text(dict[trn]["en"]);
                }
            }
        });
        
        return this;
    };
    
    // $.dictionary returns dictionary
    $.dictionary = dict;
 
}( jQuery ));
