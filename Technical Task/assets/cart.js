// ***************************************************
//get data from api
// ***************************************************
function getData() {
    var val = [];
    try {
        results = $.ajax({
            url: 'http://smartrestaurantsolutions.com/mobileapi-test/Tigger.php?funId=81&rest_id=645',
            type: "GET",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            async: false,
            success: function (res) {
                val = res;
            },
            error: function (err) {
                console.log(err);
            }
        });
    }
    catch (ex) {
        console.log(ex);
    }
    finally {
        return val;
    }
}
// ***************************************************
// get products from data
// ***************************************************

     var products=[];
      var prod = getData();
      const {app} =prod;
      var cosine = app[0].cuisine;
      const{category}= cosine[0];

      category.forEach(function (o) {
          o.dish.forEach(function (d) {
              products.push(d);
          })
      });


// ***************************************************
// Shopping Cart functions
// ***************************************************

var shoppingCart = (function () {
    // Private methods and properties
    var cart = [];

    function Item(id, name, price, count) {
        this.name = name
        this.id =id
        this.price = price
        this.count = count
    }

    function saveCart() {
        localStorage.setItem("shoppingCart", JSON.stringify(cart));
    }

    function loadCart() {
        cart = JSON.parse(localStorage.getItem("shoppingCart"));
        if (cart === null) {
            cart = []
        }
    }

    loadCart();

    // Public methods and properties
    var obj = {};

    obj.addItemToCart = function (id, name, price, count) {
        for (var i in cart) {
            if (cart[i].id === id) {
                cart[i].count += count;
                saveCart();
                return;
            }
        }

        console.log("addItemToCart:", id, name, price, count);

        var item = new Item(id, name, price, count);
        cart.push(item);
        saveCart();
    };

    obj.getCartItemQuantity = function (id) {
        for (var i in cart) {
            if (cart[i].id == id.toString()) {
                return cart[i].count;
            }
        }
        return 1;
    };
    obj.setCountForItem = function (id, count) {
        for (var i in cart) {
            if (cart[i].id === id) {
                cart[i].count = count;
                break;
            }
        }
        saveCart();
    };


    obj.removeItemFromCart = function (id) { // Removes one item
        for (var i in cart) {
            if (cart[i].id === id) {    // "3" === 3 false
                cart[i].count--; // cart[i].count --
                if (cart[i].count === 0) {
                    cart.splice(i, 1);
                }
                break;
            }
        }
        saveCart();
    };


    obj.removeItemFromCartAll = function (id) { // removes all item name
        for (var i in cart) {
            if (cart[i].id === id) {
                cart.splice(i, 1);
                break;
            }
        }
        saveCart();
    };


    obj.clearCart = function () {
        cart = [];
        saveCart();
    }


    obj.countCart = function () { // -> return total count
        var totalCount = 0;
        for (var i in cart) {
            totalCount += cart[i].count;
        }

        return totalCount;
    };

    obj.totalCart = function () { // -> return total cost
        var totalCost = 0;
        for (var i in cart) {
            totalCost += cart[i].price * cart[i].count;
        }
        return totalCost.toFixed(2);
    };

    obj.listCart = function () { // -> array of Items
        var cartCopy = [];
        console.log("Listing cart");
        console.log(cart);

        for (var i in cart) {
            console.log(i);

            var item = cart[i];
            var itemCopy = {};

            itemCopy.id = item.id;
            itemCopy.name = item.name;
            itemCopy.price = item.price;
            itemCopy.count = item.count;
            itemCopy.subTotal = (item.price * item.count).toFixed(2);
            cartCopy.push(itemCopy);
        }

        return cartCopy;
        // return cartCopy;
    };

    obj.returnCart = function () {
        return cart;
    }
    // ----------------------------
    return obj;
})();


function CartItem(item) {
console.log(item);
    $('#cartList').append('<tr class="cart-tr">' +
        '<td class="align-middle"><span><a href="javascript:ProductDescription(\'' + item.id + '\');">' + item.name + '</a></span></td >' +
        ' <td>'+ parseFloat(item.price).toFixed(2)+'</td>'
        + ' <td class="text-right"> <div class="quantity buttons_added">' +
        '<input type="button" value="-" onClick="minusCartItemCount(\'' + item.id + '\');"  class="minus"><input id="quantity' + item.id + '"  value="' + item.count + '" class="quantity form-control form-control-sm text-center" type="number" onchange="SetQuantity(\'' + item.id + '\');"><input type="button" onClick="plusCartItemCount(\'' + item.id + '\');" value="+" class="plus"></div></td>' +
        ' <td class="text-right align-middle"><span id="subTotal' + item.id + '" class="text-right ssubtotal">' + parseFloat(item.subTotal).toFixed(2) + '</span></td>' +
        ' <td class="text-right"><a href="javascript:RemoveCartItem(\'' + item.id + '\');" class="btn btn-sm btn-danger"><i  class="fa fa-trash" title="Remove"></i></a></td>' +
        ' </tr>');
}

function ProductLoad(data) {

    $("#products").empty();

    var op = '';
    $.each(data, function (i, d) {

                op +='<div class="col-md-4 btn"  onclick = "AddToCart( \'' + d.dish_id + '\');">'+
                '<figure class="card card-product">'+
                    '<div class="img-wrap"><img src="./assets/dist/img/default-img.png" alt="' + d.dish_name + '"  style="width: 100%; height: 85px;"></div>'+
                    '<figcaption class="info-wrap">'+
                            '<h6 class="title">' + d.dish_name +'</h6>'+
                            '<p class="desc">' + d.dish_description +'</p>'+
                    '</figcaption>'+
                    '<div class="bottom-wrap">'+
                        '<div class="price-wrap h5">'+
                            '<span class="price-new">$'+d.dish_price+'</span>'+
                        '</div>'+
                    '</div> '+
               ' </figure>'+
        '</div>';
    });
    $("#products").append(op);
}


//add cart by id
function AddToCart(id) {
  let product = products.find(x => x.dish_id === id);
  shoppingCart.addItemToCart( product.dish_id, product.dish_name, product.dish_price,1);
    DisplayCart();
}

//Display cart items & total
function DisplayCart() {
 
    var msg;
    var totalAmount = parseFloat(shoppingCart.totalCart());
    $("#totalAmmount").text(totalAmount.toFixed(2));
    $('#cartList').empty();
    var c = shoppingCart.listCart();
    for (var i = 0; i < c.length; i++) {
        CartItem(c[i]);
    }
    $("#totalItems").text(c.length);

}
//Remove a cart item
function RemoveCartItem(id) {
    shoppingCart.removeItemFromCartAll(id);
    DisplayCart();
}

//Quantity Change
function SetQuantity(id, isInventoryTrack) {
    var quantity = $("#quantity" + id).val();
if (isInventoryTrack == 'true') {
    var productquantity = getProductQuantiy(id);
    if (productquantity < quantity) {
        if (parseFloat(productquantity) == 0.0) {
            toastr.error("Sorry this product is out of stock!");
            shoppingCart.removeItemFromCartAll(id);
            DisplayCart();
        }
        else {
            toastr.warning("Availabe on stock: " + productquantity);
            $("#quantity" + id).val(productquantity);
            shoppingCart.setCountForItem(id, parseFloat(productquantity))
            DisplayCart();
        }
    }
}
else {
    shoppingCart.setCountForItem(id, parseFloat(quantity))
    DisplayCart();
}

}
//plus quantity
function minusCartItemCount(id) {
    var quantity = $("#quantity" + id).val();
    var newQuantity = parseFloat(quantity) - 1;
    if (newQuantity > 0) {
    shoppingCart.setCountForItem(id, newQuantity )
    DisplayCart();
    }
    else{
        RemoveCartItem(id)  ;
    }
}
//minus quantity
function plusCartItemCount(id) {
        var incialQuantity = $("#quantity" + id).val();
         var quantity = parseFloat(incialQuantity)+1;
        shoppingCart.setCountForItem(id, parseFloat(quantity))
        DisplayCart();
}
//reset cart
$("#reset").click(function () {
    shoppingCart.clearCart();
    DisplayCart();
});

//submit 
payment
$("#payment").click(function () {
    window.location.replace("./success.html");
});
//search
$("#search").on("keyup", function() {
    var value = $(this).val().toLowerCase();
   const result = products.filter(product => product.dish_name.toLowerCase().includes(value));
   ProductLoad(result);
  });