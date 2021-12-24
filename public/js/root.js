const root = location.protocol + "//" + location.host;

$(".addToCart").click(function (event) {
  event.preventDefault();
  const href = this.href;
  console.log(href);
  $.ajax({
    url: href,
    type: "GET",
    data: {},
    success: function () {
      swal("Add successfully", "Continue", "success");
      $("#numCart1").load(root + " #numCart2");
    },
  });
});

// $('.reduceFormCart').on("submit", function(event){
//     event.preventDefault();
//     const action=$(this).attr('action');
//     const id =$(this).data('id');
//     const qty2="#qty2"+id
//     const tr_cart_id="#tr_cart_"+id
//     $.ajax({
//         urf: action,
//         type: 'PUT',
//         data:{},
//         success: function () {
//             swal("Edit successfully", "Continue", "success");
//             $("#total1").load(root+"/cart #total2");
//             $("#qty").load(root+"/cart"+qty2);
//             $("#inforNumber").load(root+"/cart #numberCart");
//             if($(qty2).text()==='1'){
//                 $(tr_cart_id).empty();
//             }
//         }
//     })
// })

$(".deleteFormCart").on("submit", function (event) {
  event.preventDefault();
  const action = $(this).attr("action");
  const href = root + action;
  const tr_cart_id = "#tr_cart_" + $(this).data("id");

  $.ajax({
    url: href,
    type: "POST",
    data: {},
    success: function () {
      swal("Delete successful!", "continute!", "success");
      $("#total1").load(root + "/cart #total2");
      $(tr_cart_id).empty();
      $("#infoNumber").load(root + "/cart +#numberCart");
    },
  });
});
