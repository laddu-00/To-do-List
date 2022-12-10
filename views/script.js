

$("#btn").on("mouseover",function(btn){///#=>id .=>class nothing=tag name plz remember
    $("#btn").addClass("transparency");
});

$("#btn").on("mouseout",function(btn){
    $("#btn").removeClass("transparency");
});
$("#btn").on("click",function(btn){///#=id .=class nothing=tag name plz remember
    $("#btn").addClass("transition");
});

$("#btn").on("mouseup",function(btn){
    $("#btn").removeClass("transition");
});
function fun()
{
disppressedbtn.value='showsignuppage';

}


   
