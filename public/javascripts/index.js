$(function () {
    $("#publish-weibo").click(function () {
        alert("发送");
    });
    $.ajax({
        url: "ajax/ajax_selectPicType.aspx",
        data: { Full: "fu" },
        type: "POST",
        dataType: 'json',
        success: CallBack,
        error: function (er) {
            BackErr(er);
        }

    });
});