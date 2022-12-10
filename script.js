function onclick(btn)
{
    btn.classList.addClass('click');
    setTimeout(function(){btn.classList.removeClass('click');},100);
}