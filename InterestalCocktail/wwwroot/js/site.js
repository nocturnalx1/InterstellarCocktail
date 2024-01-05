const instance = axios.create({
    baseURL: '/',
    timeout: 4000
});

$(document).ready(function () {

    $("body").css({ overflow: "visible" });
    $("#sendExecute").on("click", async function () {
        DeleteItems();
        ShowLoader(2000, async function () {
            await sendExecute({ "searchData": $("#SearchData").val() }).then(function (ret) {
                generateControl(ret.data.cocktel, function () {
                    HideLoader(2000);
                })

            }).catch(function (err) {
                HideLoader(2000, function () {

                })
            });
        })

    })

});

function ShowLoader(time = 1000, callback) {
    $("body").css({ overflow: "hidden" });
    $("#loading").fadeIn(time, function () {
        if (callback != undefined) {
            callback();
        }

    });
}

function HideLoader(time = 1000, callback) {

    $("#loading").fadeOut(time, function () {
        if (callback != undefined) {
            callback();
        }
        $("body").css({ overflow: "visible" });
    });
}

function DeleteItems() {
    var rootCtl = $(".space-container");
    rootCtl.empty();
}

function DeleteDetail() {
    let rootCtl = $("#CoktelDetail");
    rootCtl.empty();
    $("#picCocketl").attr("src", "");
    $("#modalCocktelDetailTitle").text("");
    $("#cocktelInstructions").text("");
    $("#cocktelFavorite").removeClass("active");
}
function generateDetail(data, ingredients, callback) {
    let rootCtl = $("#CoktelDetail");
    rootCtl.empty();
    $("#modalCocktelDetailTitle").text(data.strDrink).data("id", data.idDrink);
    $("#picCocketl").attr("src", data.strDrinkThumb);
    $("#cocktelInstructions").text(data.strInstructions);

    if (checkIsFavorite(data.idDrink)) {
        $("#cocktelFavorite").addClass("active");
    }
    $("#cocktelFavorite").off("click");
    $("#cocktelFavorite").on("click", function () {

        let dringTitle = $("#modalCocktelDetailTitle").text();
        let id = $("#modalCocktelDetailTitle").data("id");
        if (addFavorite(id)) {
            $(this).addClass("active");
            var IconHeart = $("<i/>").addClass("bi").addClass("bi-heart-fill")
            var PicFav = $("<div/>").addClass("CocktelFavorite").addClass("btn-fav").addClass("active")
            PicFav.append(IconHeart);
            $(".pic").filterByData("id", id).append(PicFav);
            showAlert("Favoritos", "Se ha ingresado el cocktel " + dringTitle + " a favoritos");
        } else {
            removeFavorite(id);
            $(this).removeClass("active");
            $(".pic").filterByData("id", id).find(".CocktelFavorite").remove();
            showAlert("Favoritos", "Se ha eliminado el cocktel " + dringTitle + " de favoritos");
        }

    })


    $.each(ingredients, function (index, item) {

        var img = "https://www.thecocktaildb.com/images/ingredients/" + item + "-Small.png"
        var ImgIngredient = $("<img/>").addClass("pic-image").prop("alt", "Imagen").prop("src", img)
        var CocktelIngrediente = $("<div/>").addClass("CocktelIngrediente").text(item);
        CocktelIngrediente.append(ImgIngredient);
        rootCtl.append(CocktelIngrediente);
    })
}

function checkIsFavorite(id) {
    let favList = window.localStorage.getItem("fav");
    if (favList != null) {
        let ksonRetObject = JSON.parse(favList);
        var item = { "id": id };
        return isDuplicate(ksonRetObject, item);
    } else {
        return false;
    }

}

function removeFavorite(id) {
    let objectFav = [];
    let favList = window.localStorage.getItem("fav");
    if (favList != null) {
        let ksonRetObject = JSON.parse(favList);
        ksonRetObject = ksonRetObject.filter(i => i.id == id == 0)
        window.localStorage.setItem("fav", JSON.stringify(ksonRetObject))
    }


}
function addFavorite(id) {
    let objectFav = [];

    let favList = window.localStorage.getItem("fav");
    if (favList != null) {
        let ksonRetObject = JSON.parse(favList);
        objectFav = ksonRetObject;
    }

    var item = { "id": id };

    if (!isDuplicate(objectFav, item)) {
        objectFav.push(item);
        window.localStorage.setItem("fav", JSON.stringify(objectFav))
        return true;
    } else {
        return false;
    }

}

function isDuplicate(array, data) {

    if (array.length == 0) return false;

    let ret = array.some((element, index) => {
        if (element.id == data.id) {
            return true;
        } else {
            return false;
        }
    });
    return ret;

}
function generateControl(data, callback) {
    var rootCtl = $(".space-container");
    DeleteItems();

    $.each(data, function (index, item) {



        //<div id="cocktelFavorite" class="CocktelFavorite btn-fav">
        //    <i class="bi bi-heart-fill"></i>
        //</div>

        var pic = $("<div/>").addClass("pic").prop("data-id", item.idDrink).attr("data-id", item.idDrink).data("id", item.idDrink);
        var img = $("<img/>").addClass("pic-image").prop("alt", "Imagen").prop("src", item.strDrinkThumb)
        var caption = $("<div/>").addClass("pic-caption").addClass("bottom-to-top")
        var spaceCaption = $("<p/>").addClass("space-Caption").text(item.strDrink)
        var spaceDescription = $("<p/>").addClass("space-description").text(item.strInstructions != "" ? item.strInstructions : "No hay descripción")
        var descCaption = $("<div/>").addClass("desc-caption").text(item.strDrink)

        var IconHeart = $("<i/>").addClass("bi").addClass("bi-heart-fill")
        var PicFav = $("<div/>").addClass("CocktelFavorite").addClass("btn-fav").addClass("active")
        PicFav.append(IconHeart);


        caption.append(spaceCaption);
        caption.append(spaceDescription);
        pic.append(img);
        pic.append(caption);
        pic.append(descCaption);

        if (checkIsFavorite(item.idDrink)) {
            pic.append(PicFav);
        }

        rootCtl.append(pic);


        pic.on("mouseover", function (e) {
            $(e.currentTarget).find(".desc-caption").addClass("desc-caption-hidde").removeClass("desc-caption");
        })
        pic.on("mouseout", function (e) {
            $(e.currentTarget).find(".desc-caption-hidde").addClass("desc-caption").removeClass("desc-caption-hidde");
        })

        pic.on("click", function (e) {
            //$(e.currentTarget).find(".desc-caption-hidde").addClass("desc-caption").removeClass("desc-caption-hidde");
            var id = $(e.currentTarget).data("id");
            $("#modalCocktelDetail").data("id", id);
            DeleteDetail();
            $("#modalCocktelDetail").on("shown.bs.modal", async function () {
                let dataId = $("#modalCocktelDetail").data("id");

                await sendExecuteById({ "searchData": dataId }).then(function (ret) {

                    if (ret.data.cocktel.length == 1) {
                        let ingredients = parseIngredients(ret.data.cocktel[0])
                        generateDetail(ret.data.cocktel[0], ingredients, function () {

                        })
                    }
                }).catch(function (err) {
                    alert("error")
                });
            })

            $("#modalCocktelDetail").on("hidden.bs.modal", function () {
                $("#modalCocktelDetail").data("id", null);
                DeleteDetail();
            })
            $("#modalCocktelDetail").modal('show');
        })



    });

    if (callback != undefined) {
        callback();
    }

}

function showAlert(title, msg) {

    Lobibox.notify(
        'success',  // Available types 'warning', 'info', 'success', 'error'
        {
            position: "top right",
            delay: 10000,
            icon: false,
            title: title,
            msg: msg
        }
    );

}
function parseIngredients(obj) {
    let ingredients = [];
    let result = "";
    for (const i in obj) {
        if (i.includes("strIngredient")) {
            if (Object.hasOwn(obj, i)) {
                if (obj[i] != null) {
                    ingredients.push(obj[i]);
                }
            }
        }

    }
    return ingredients;
}

const sendExecuteById = async (newPost) => {
    try {
        return await axios({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            url: "/Home/ExecuteById",
            data: JSON.stringify(newPost)
        }).then(function (resp) {

            return resp;
        }).catch(function (err) {
            throw err;
        });
    } catch (e) {
        throw e;
    }

}

const sendExecute = async (newPost) => {
    try {
        return await axios({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            url: "/Home/Execute",
            data: JSON.stringify(newPost)
        }).then(function (resp) {

            return resp;
        }).catch(function (err) {
            throw err;
        });
    } catch (e) {
        throw e;
    }
}

$.fn.filterByData = function (prop, val) {
    return this.filter(
        function () { return $(this).data(prop) == val; }
    );
}
