var pristine;

document.addEventListener("DOMContentLoaded", () => {
    ImageLoader.overlay = document.querySelector(".img-upload__overlay");
    ImageLoader.previewImage = document.querySelector(".img-upload__overlay .img-upload__preview img");
    ImageLoader.scaler.input = document.querySelector(".scale input.scale__control--value");
    ImageLoader.slider.element = document.querySelector(".effect-level__slider")
    ImageLoader.slider.input = document.querySelector("input[name='effect-level']")

    pristine = new Pristine( document.getElementById("upload-select-image") );
    var elem = document.getElementById("hashtags-field");
    var error = "hashtags should start with '#' and splitted by ' ', can't have more than 5, not be more than 20 chars, can't have special chars (#, @, $ and other), can't have dublicate hashtags";
    pristine.addValidator(elem, function(value) 
    {
        if (value == "") return true;

        let format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
        let words = value.split(' ');

        if (words.length > 5) return false;
        
        for (let i = 0; i < words.length; i++) 
        {
            words[i] = words[i].toLowerCase(); 

            if (words[i].substring(0, 1) != "#") return false;
          
            if (words[i].length > 20) return false;
            
            if ( format.test(words[i].substring(1, words[i].length)) ) return false;
        }

        if ( words.some(x => words.indexOf(x) !== words.lastIndexOf(x)) ) return false;
         
        return true;

    }, error, 2, false);

});

document.addEventListener('keydown', function(event) 
{
    if (event.code == 'Escape' && event.target.name != "hashtags" && event.target.name != "description") 
    {
        if (document.querySelector("section.error"))
        {
            document.querySelector("section.error:not(.other)").remove();
            ImageLoader.openModal();
        }
        else if (document.querySelector("section.success")) document.querySelector("section.success").remove();
        else ImageLoader.closeModal();
    }
});

ImageLoader = {
    overlay: undefined,
    previewImage: undefined,
    scaler: {
        input: undefined,
        defaultStep: 25,
        reduce()
        {
            let currentValue = this.input.value;
            let newValue = Number( currentValue.replace('%', '') ) - this.defaultStep;
            
            if (newValue >= 25) 
            {
                this.input.value = newValue + "%";
                ImageLoader.previewImage.style.transform ='scale(' + newValue / 100 + ')'; 
            }
        },
        increase()
        {
            let currentValue = this.input.value;
            let newValue =  Number( currentValue.replace('%', '') ) + this.defaultStep;
            
            if (newValue <= 100)
            {
                this.input.value = newValue + "%";
                ImageLoader.previewImage.style.transform ='scale(' + newValue / 100 + ')'; 
            } 
        },
    },
    slider:{
        element: undefined,
        input: undefined,
        create()
        {
            noUiSlider.create(this.element, {
                start: 100,
                connect: true,
                range: {
                    'min': 0,
                    'max': 100
                }
            });

            this.element.style.display = "none";

            let thisObject = this;
            this.element.noUiSlider.on('update.one', function (values) 
            {
                thisObject.input.value = Math.round(values[0]);
                thisObject.changeFilterPower();
            });
        },
        changeFilterPower()
        {
            let value = this.input.value;
        
            switch (ImageLoader.activeFilter) 
            {
                case "chrome":
                    ImageLoader.previewImage.style.filter = "grayscale("+ value / 100 +")";
                    break;
                case "sepia":
                    ImageLoader.previewImage.style.filter = "sepia("+ value / 100 +")";
                    break;
                case "marvin":
                    ImageLoader.previewImage.style.filter = "invert("+ value +"%)";
                    break;
                case "phobos":
                    ImageLoader.previewImage.style.filter = "blur("+ value / 33 +"px)";
                    break;
                case "heat":
                    ImageLoader.previewImage.style.filter = "brightness("+ value / 33 +")";
                    break;
                default:
                    ImageLoader.activeFilter = "none";
                    break;
            }
        }
    },
    effectIds: [
        "effect-none", "effect-chrome", "effect-sepia",
        "effect-marvin", "effect-phobos", "effect-heat"
    ],
    activeFilter: "",
    onLoadImage(value)
    {
        if (!value) return;

        this.slider.create();
        this.setFilePreview(value.files);       
        this.openModal();
        this.previewImage.focus();
    },
    openModal()
    {
        this.overlay.classList.remove("hidden");
        document.body.classList.add("modal-open");
    },
    hideModal()
    {
        this.overlay.classList.add("hidden");
        document.body.classList.remove("modal-open");
    },
    closeModal()
    {
        this.overlay.classList.add("hidden");
        document.body.classList.remove("modal-open");

        if (this.slider.element.noUiSlider) this.slider.element.noUiSlider.destroy();
        this.previewImage.classList.remove(...this.previewImage.classList)
        this.activeFilter = "none";
    },
    setFilePreview(files)
    {
        let thisObject = this;

        if (FileReader && files && files.length) 
        {
            var fr = new FileReader();
            fr.readAsDataURL(files[0]);
            fr.onload = function () 
            {
                thisObject.previewImage.src = fr.result;

                for (let index = 0; index < thisObject.effectIds.length; index++) 
                    document.querySelector("#"+ thisObject.effectIds[index] +" + label span").style.backgroundImage = "url("+fr.result+")";
            }
        }
    },
    switchFilterPreview(filter)
    {
        this.previewImage.classList.remove(...this.previewImage.classList)
        this.slider.element.noUiSlider.set(100);
        this.activeFilter = filter;

        if (filter == "none")
        {
            this.slider.element.style.display = "none";
            return
        } 
        
        this.slider.element.style.display = "block";
        this.previewImage.classList.add("effects__preview--"+ filter);
    },
    submit(form, event)
    {
        event.preventDefault();

        var data = new FormData(form);
        var valid = pristine.validate();
        
        if (valid)
        {
            form.querySelector("button[type='submit']").disabled = true;
            let thisObject = this;

            $.ajax({
                url: "https://26.javascript.pages.academy/kekstagram",
                enctype: 'multipart/form-data',
                type: 'POST',
                data: data,
                contentType: false,
                cache: false,
                processData: false,
                success: function (data)
                {
                    form.querySelector("button[type='submit']").disabled = false;

                    let cloneTemplate = document.querySelector('#success').content.cloneNode(true); 

                    document.body.appendChild(cloneTemplate);
                    thisObject.closeModal();
                },
                error: function (data)
                {
                    form.querySelector("button[type='submit']").disabled = false;

                    let cloneTemplate = document.querySelector('#error').content.cloneNode(true); 

                    document.body.appendChild(cloneTemplate);
                    thisObject.hideModal();
                }
            });
        }
        
    }
}