(function ( $ ) {
    const dict = {
        "imageCreationError":{
          cs: "Nemohu vytvořit obraz",
          en: "Cannot create image"
        },
        "focal distance":{
          cs: "Ohnisková vzdálenost",
          en: "Focal distance"
        },
        "object distance":{
          cs: "Předmětová vzdálenost",
          en: "Object distance"
        },
        "image distance":{
          cs: "Obrazová vzdálenost",
          en: "Image distance"
        },
        "magnification":{
          cs: "Poměr zvětšení",
          en: "Magnification ratio"
        },
        "pixels":{
          cs: "pixelů",
          en: "pixels"
        },
        "lenRadius":{
          cs: "Poloměr čočky",
          en: "Len radius"
        },
        "centre":{
          cs: "Vystředit",
          en: "Centre"
        },
        "showLenCircles": {
          cs: "Zobrazit kružnice čočky",
          en: "Show circles of lens"
        },
        "showLenLeftPoints": {
          cs: "Zobrazit levé body čočky",
          en: "Show left points of lens"
        },
        "showLenFocus": {
          cs: "Zobrazit ohniska",
          en: "Show focus points"
        },
        "showLenCenter": {
          cs: "Zobrazit středy kružnic čočky",
          en: "Show centers of lens circles"
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
