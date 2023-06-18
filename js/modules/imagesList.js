document.addEventListener("DOMContentLoaded", () => {
    ImagesList.overlay = document.querySelector(".big-picture.overlay");

    ImagesList.getList();
});

document.addEventListener('keydown', function(event) 
{
    if (event.code == 'Escape') 
    {
        ImagesList.closeModal();
    }
});

var ImagesList = {
    overlay: undefined,
    currentEl: 0,
    list: [],
    openModal(el)
    {
        
        this.overlay.classList.remove("hidden");
        document.body.classList.add("modal-open");

        let id = el.dataset.id;
        this.currentEl = id;

        this.overlay.querySelector(".big-picture__img img").src = this.list[id].url;
        this.overlay.querySelector(".big-picture__img img").alt = this.list[id].name;
        this.overlay.querySelector(".social__header .likes-count").textContent = this.list[id].likes;
        this.overlay.querySelector(".social__caption").textContent = this.list[id].description;
        this.overlay.querySelector(".social__comment-count .comments-count").textContent = this.list[id].comments.length;

        if (this.list[id].comments.length <= 5) 
            document.querySelector("button.social__comments-loader").classList.add("hidden");

        for (let i = 0; i < this.list[id].comments.length; i++) 
        {
            let cloneTemplate = document.querySelector('#comment').content.cloneNode(true); 

            if (i > 4) cloneTemplate.querySelector(".social__comment").classList.add("hidden");
            
            cloneTemplate.querySelector("img.social__picture").src = this.list[id].comments[i].avatar;
            cloneTemplate.querySelector(".social__text").textContent = this.list[id].comments[i].message;

            this.overlay.querySelector("ul.social__comments").appendChild(cloneTemplate)
        }

        this.recountComments();
    },
    showMoreComments()
    {
        let commentsHidden = document.querySelectorAll("ul li.social__comment.hidden");

        if (commentsHidden.length > 0)
        {
            numCallbackRuns = 0;
            commentsHidden.forEach(element => {
                if (numCallbackRuns < 5) element.classList.remove("hidden");

                numCallbackRuns++;
            });
            
            this.recountComments();
        }
    },
    recountComments()
    {
        let comments = this.overlay.querySelectorAll("ul li.social__comment:not(.hidden)");

        this.overlay.querySelector(".social__comment-count .current").textContent = comments.length;

        if (comments.length == this.list[this.currentEl].comments.length) 
            this.overlay.querySelector("button.social__comments-loader").classList.add("hidden");
    },
    closeModal()
    {
        this.overlay.classList.add("hidden");
        document.body.classList.remove("modal-open");

        this.overlay.querySelector("ul.social__comments").innerHTML = '';
        this.overlay.querySelector("button.social__comments-loader").classList.remove("hidden");
    },
    filterPictures(value)
    {
        let pictures = document.querySelectorAll("a.picture");
        pictures.forEach(element => { element.remove() });

        switch (value) 
        {
            case "default":
                this.list.sort(function(a, b) {
                    return parseFloat(a.id) - parseFloat(b.id);
                });
                break;
            case "top":
                this.list.sort(function(a, b) {
                    return parseFloat(b.comments.length) - parseFloat(a.comments.length);
                });
                break;
            case "random":
                this.list = this.list.map(value => ({ value, sort: Math.random() }))
                    .sort((a, b) => a.sort - b.sort)
                    .map(({ value }) => value)
                break;
            default:
                break;
        }

        this.loadList();
    },
    getList()
    {
        $.ajax({
            url: "https://26.javascript.pages.academy/kekstagram/data",
            success: function (data)
            {
                ImagesList.list = data;
                ImagesList.loadList();

                document.querySelector(".img-filters--inactive").style.opacity = 1;
            },
            error: function (data)
            {
                let cloneTemplate = document.querySelector('#error-list').content.cloneNode(true); 

                document.body.appendChild(cloneTemplate);
                thisObject.hideModal();
            }
        });
    },
    loadList()
    {
        for (let i = 0; i < this.list.length; i++) 
        {
            let cloneTemplate = document.querySelector('#picture').content.cloneNode(true); 
            cloneTemplate.querySelector("a.picture > img").src = this.list[i].url;
            cloneTemplate.querySelector("a.picture .picture__comments").textContent = this.list[i].comments.length;
            cloneTemplate.querySelector("a.picture .picture__likes").textContent = this.list[i].likes;
            cloneTemplate.querySelector("a.picture").dataset.id = i;


            document.getElementById('pictures-list-containter').appendChild(cloneTemplate);
        }
    }
}