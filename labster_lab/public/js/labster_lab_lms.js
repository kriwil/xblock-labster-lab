function LabsterLabXBlock(runtime, element) {

    var _host = "192.168.3.10";

    var lab_proxies_url = "http://" + _host + ":8000/labster/api/v2/lab-proxies/";
    var lab_lms_view = $("#labster_lab_lms_view");
    var lab_proxy_id = lab_lms_view.data("lab-proxy-id");
    var lab_lms_view_template = _.template(
        $("#labster_lab_lms_view_template").html()
    );

    var a_link = lab_lms_view.find(".play-lab-fullscreen");
    a_link.click(function(ev) {
        ev.preventDefault();
        var el = $(ev.currentTarget);
        var unity_block = el.next(".unity-block");
        unity_block.fullScreen(true);
    });

    $(document).bind("fullscreenchange", function() {
        var is_fullscreen = $(document).fullScreen();
        if (is_fullscreen) {
            $(".unity-block").show();
        } else {
            $(".unity-block").hide();
        }
    });

    // var _url = lab_proxies_url + lab_proxy_id + "/";
    // $.ajax({
    //     type: "GET",
    //     url: _url,
    //     success: function(response) {
    //         lab_lms_view
    //             .empty()
    //             .append(lab_lms_view_template({lab_proxy: response}));
    //     }
    // });

}
